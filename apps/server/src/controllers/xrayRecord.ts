import { Request, NextFunction } from 'express';
import db from '@/db';
import { XrayRecord, XrayImage } from '@/db/models';
import { success } from '@/utils/response';
import { getFileMeta, uploadFileToS3 } from '@/utils/upload';
import { getNowDate } from '@cbct/utils/moment';
import { GetByIdResponse } from '@cbct/api/response/xrayRecord';
import { assetProviderOrigin, getDirectory, getImageUrl } from '@/utils/media';
import type { GetRecordsRequest, CreateRequest } from '@cbct/api/request/xrayRecord';
import type { GetRecordsResponse } from '@cbct/api/response/xrayRecord';
import { raw } from 'objection';

/**
 * @preserve
 * @swagger
 * /api/xray/records:
 *   get:
 *     summary: Get patient xray records
 *     description: Get patient xray records
 *     tags: ['xray/records']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/xrayRecord/getRecordsResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getRecords = async (
  req: QueryRequest<GetRecordsRequest>,
  res: DataResponse<GetRecordsResponse>,
  next: NextFunction
) => {
  try {
    const patientId = req.query.patientId;

    const records = await XrayRecord.query(db)
      .withGraphFetched('images')
      .modifyGraph('images', qb => qb.select(
        'id',
        raw('originalname').as('name'),
        raw(`CONCAT('${assetProviderOrigin}', '/', path)`).as('url')
      ))
      .where('patientId', patientId)
      .orderBy('date', 'desc')
      .select('date');

    return res.json(success('SUCCESS', records));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/xray/records/{id}:
 *   get:
 *     summary: Get xray record by id
 *     description: Get xray record by id
 *     tags: ['xray/records']
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
 *               $ref: '#/schemas/xrayRecord/getByIdResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getById = async (
  req: Request,
  res: DataResponse<GetByIdResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const xrayRecord = await XrayRecord.query(db)
      .withGraphFetched('images')
      .modifyGraph('images', qb => qb.select('originalname', 'path'))
      .where('id', id)
      .first()
      .then(record => ({
        ...record,
        directory: getDirectory(record!.images![0].path),
        images: record!.images!.map(image => ({
          originalName: image.originalname,
          url: getImageUrl(image.path)
        }))
      }));

    return res.json(success('SUCCESS', xrayRecord));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/xray/records:
 *   post:
 *     summary: Create xray record
 *     description: Create xray record
 *     tags: ['xray/records']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/schemas/xrayRecord/createRequest'
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
export const create = async (
  req: BodyRequest<CreateRequest>,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const patientId = req.body.patientId;
    const images = req.files as UploadFile[];

    await db.transaction(async trx => {
      const record = await XrayRecord.query(trx).insert({
        id: req.preGenId,
        date: getNowDate(),
        patientId
      });

      await Promise.all(images.map(async image => {
        const meta = getFileMeta(image);
        await XrayImage.query(trx).insert({
          id: image.uuid,
          recordId: record.id,
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
