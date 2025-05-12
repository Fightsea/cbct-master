import { Request, NextFunction } from 'express';
import { success } from '@/utils/response';
import type { CreateRequest } from '@cbct/api/request/clinic';
import type {
    GetAffiliatedResponse,
    GetPhotoResponse,
} from '@cbct/api/response/clinic';
import { Clinic, ClinicMember, ClinicPhoto } from '@/db/models';
import db from '@/db';
import { raw } from 'objection';
import { getFileMeta, uploadFileToS3 } from '@/utils/upload';
import { Role } from '@cbct/enum/clinicMember';
import { getImageUrl } from '@/utils/media';
import { NotFoundError } from '@/utils/error';

/**
 * @preserve
 * @swagger
 * /api/clinics/affiliated:
 *   get:
 *     summary: Get affiliated clinics
 *     description: Get affiliated clinics
 *     tags: ['clinics']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/clinic/getAffiliatedResponse'
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getAffiliated = async (
    req: Request,
    res: DataResponse<GetAffiliatedResponse>,
    next: NextFunction
) => {
    try {
        const clinics = await ClinicMember.query(db)
            .joinRelated('clinic')
            .where('userId', req.user!.id)
            .select(
                'clinic.id',
                'clinic.name',
                'clinic.address',
                raw(`(
          SELECT COUNT(*)
          FROM clinic_members
          WHERE clinic_members."clinicId" = clinic.id
        )`).as('userCount')
            )
            .castTo<
                {
                    id: uuid;
                    name: string;
                    address: string;
                    userCount: string;
                }[]
            >()
            .then((clinics) =>
                clinics.map((clinic) => {
                    console.log({ clinic });
                    return {
                        ...clinic,
                        userCount: +clinic.userCount,
                    };
                })
            );

        return res.json(success('SUCCESS', clinics));
    } catch (e) {
        next(e);
    }
};

/**
 * @preserve
 * @swagger
 * /api/clinics/{id}/photo:
 *   get:
 *     summary: Get clinic photo
 *     description: Get clinic photo
 *     tags: ['clinics']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/clinic/getPhotoResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getPhoto = async (
    req: Request,
    res: DataResponse<GetPhotoResponse>,
    next: NextFunction
) => {
    try {
        const id = req.params.id;

        const photo = await ClinicPhoto.query(db).where('clinicId', id).first();

        if (!photo) {
            throw new NotFoundError();
        }

        return res.json(success('SUCCESS', getImageUrl(photo.path)));
    } catch (e) {
        next(e);
    }
};

/**
 * @preserve
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Create clinic
 *     description: Create clinic
 *     tags: ['clinics']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/schemas/clinic/createRequest'
 *     responses:
 *       200:
 *         description: "`CREATE_SUCCESS`"
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const create = async (
    req: BodyRequest<CreateRequest>,
    res: NoDataResponse,
    next: NextFunction
) => {
    try {
        const body = req.body;
        const file = req.file as UploadFile;

        await db.transaction(async (trx) => {
            // Create clinic
            const clinic = await Clinic.query(trx).insert(body);

            // Create clinic member
            await ClinicMember.query(trx).insert({
                clinicId: clinic.id,
                userId: req.user!.id,
                role: Role.ADMIN,
                isOwner: true,
            });

            // Create clinic photo
            const meta = getFileMeta(file);
            await ClinicPhoto.query(trx).insert({
                clinicId: clinic.id,
                ...meta,
            });

            // Upload file to S3
            await uploadFileToS3(meta.path);
        });

        return res.json(success('CREATE_SUCCESS'));
    } catch (e) {
        next(e);
    }
};
