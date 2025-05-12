import { Request, Response, NextFunction } from 'express';
import { success } from '@/utils/response';
import db from '@/db';
import { PatientPhoto } from '@/db/models';
import { getFileMeta, uploadFileToS3 } from '@/utils/upload';
import { PatientPhotoType } from '@cbct/enum/patientPhoto';
import { UploadRequest, SwitchTypeRequest } from '@cbct/api/request/patientPhoto';
import type { GetPhotosResponse, GetTaggedResponse } from '@cbct/api/response/patientPhoto';
import { deleteFile } from '@/utils/s3';
import { assetProviderOrigin, getImageUrl } from '@/utils/media';
import { raw } from 'objection';
import { groupBy } from 'lodash';

/**
 * @preserve
 * @swagger
 * /api/patient-photos/{patientId}:
 *   get:
 *     summary: Get patient photos
 *     description: Get patient photos
 *     tags: ['patient-photos']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/patientId'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/patientPhoto/getPhotosResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getPhotos = async (
  req: Request,
  res: DataResponse<GetPhotosResponse>,
  next: NextFunction
) => {
  try {
    const patientId = req.params.patientId;

    const photos = await PatientPhoto.query(db)
      .where('patientId', patientId)
      .orderBy('createdAt', 'desc')
      .select(
        'id',
        'originalname',
        raw(`CONCAT('${assetProviderOrigin}', '/', path)`).as('url'),
        raw('"createdAt"::date').as('date')
      );

    const dateGroup = groupBy(photos, 'date');

    return res.json(success('SUCCESS', dateGroup));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patient-photos/{patientId}/tagged:
 *   get:
 *     summary: Get front and profile patient photos
 *     description: Get front and profile patient photos
 *     tags: ['patient-photos']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/patientId'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/patientPhoto/getTaggedResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getTagged = async (
  req: Request,
  res: DataResponse<GetTaggedResponse>,
  next: NextFunction
) => {
  try {
    const patientId = req.params.patientId;

    const photos = await PatientPhoto.query(db)
      .where('patientId', patientId)
      .whereIn('type', [PatientPhotoType.FRONT, PatientPhotoType.PROFILE])
      .select('id', 'path', 'type');

    const front = photos.find(p => p.type === PatientPhotoType.FRONT);
    const profile = photos.find(p => p.type === PatientPhotoType.PROFILE);

    return res.json(success('SUCCESS', {
      front: front ? { id: front.id, url: getImageUrl(front.path) } : null,
      profile: profile ? { id: profile.id, url: getImageUrl(profile.path) } : null
    }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patient-photos:
 *   post:
 *     summary: Upload patient photo
 *     description: Upload patient photo
 *     tags: ['patient-photos']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/schemas/patientPhoto/uploadRequest'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `MIMETYPE_ERROR`: File is not a valid format.
 *           - `UPLOAD_LENGTH_NOT_ENOUGH`: Must upload at least 1 image.
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const upload = async (
  req: BodyRequest<UploadRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { frontFileName, profileFileName, patientId } = req.body;
    const files = req.files as UploadFile[];

    await db.transaction(async trx => {
      await Promise.all(files.map(async file => {
        const type = frontFileName === file.originalname
          ? PatientPhotoType.FRONT
          : profileFileName === file.originalname
            ? PatientPhotoType.PROFILE
            : PatientPhotoType.OTHER;

        /**
         * Front and profile photo can only have one
         * Set original photo type to OTHER if having new photo with FRONT or PROFILE type
         */
        if (type !== PatientPhotoType.OTHER) {
          await PatientPhoto.query(trx)
            .patch({ type: PatientPhotoType.OTHER })
            .where('patientId', patientId)
            .andWhere('type', type);
        }

        const meta = getFileMeta(file);
        await PatientPhoto.query(trx).insert({
          id: file.uuid,
          patientId,
          type,
          ...meta
        });

        await uploadFileToS3(meta.path);
      }));
    });

    return res.json(success('SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patient-photos/{id}/type:
 *   put:
 *     summary: Switch patient photo type
 *     description: Switch patient photo type
 *     tags: ['patient-photos']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/patientPhoto/switchTypeRequest'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `NOT_FOUND`: Photo not found.
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const switchType = async (
  req: BodyRequest<SwitchTypeRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { type } = req.body;

    const photo = await PatientPhoto.query(db).findById(id);
    if (!photo) throw new Error('NOT_FOUND');

    await db.transaction(async trx => {
      // Set original photo type to OTHER
      await PatientPhoto.query(trx)
        .patch({ type: PatientPhotoType.OTHER })
        .where('type', type)
        .andWhere('patientId', photo.patientId);

      // Set type to latest selected photo
      await PatientPhoto.query(trx)
        .patch({ type })
        .where('id', id);
    });

    return res.json(success('SWITCH_SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patient-photos/{id}:
 *   delete:
 *     summary: Delete patient photo
 *     description: Delete patient photo
 *     tags: ['patient-photos']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: "`DELETE_SUCCESS`"
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `NOT_FOUND`: Photo not found.
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const destroy = async (
  req: Request,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const photo = await PatientPhoto.query(db).findById(id);
    if (!photo) throw new Error('NOT_FOUND');

    await db.transaction(async trx => {
      await PatientPhoto.query(trx).deleteById(id);

      await deleteFile(photo.path);
    });

    return res.json(success('DELETE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
