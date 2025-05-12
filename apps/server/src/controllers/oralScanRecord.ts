import { Request, NextFunction } from 'express';
import db from '@/db';
import { OralScanFile, OralScanRecord } from '@/db/models';
import { success } from '@/utils/response';
import { getFileMeta, uploadFileToS3 } from '@/utils/upload';
import { getNowDate } from '@cbct/utils/moment';
import { GetByIdResponse } from '@cbct/api/response/xrayRecord';
import { assetProviderOrigin, getDirectory, getImageUrl } from '@/utils/media';
import type { GetRecordsRequest, CreateRequest } from '@cbct/api/request/oralScanRecord';
import type { GetRecordsResponse } from '@cbct/api/response/oralScanRecord';
import { raw } from 'objection';

/**
 * @preserve
 * @swagger
 * /api/oral-scan/records:
 *   get:
 *     summary: Get patient oral scan records
 *     description: Get patient oral scan records
 *     tags: ['oral-scan/records']
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
 *               $ref: '#/schemas/oralScanRecord/getRecordsResponse'
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

    const records = await OralScanRecord.query(db)
      .withGraphFetched('files')
      .modifyGraph('files', qb => qb.select(
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
 * /api/oral-scan/records/{id}:
 *   get:
 *     summary: Get oral scan record by id
 *     description: Get oral scan record by id
 *     tags: ['oral-scan/records']
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
 *               $ref: '#/schemas/oralScanRecord/getByIdResponse'
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

    const oralScanRecord = await OralScanRecord.query(db)
      .withGraphFetched('files')
      .modifyGraph('files', qb => qb.select('originalname', 'path'))
      .where('id', id)
      .first()
      .then(record => ({
        ...record,
        directory: getDirectory(record!.files![0].path),
        files: record!.files!.map(file => ({
          originalName: file.originalname,
          url: getImageUrl(file.path)
        }))
      }));

    return res.json(success('SUCCESS', oralScanRecord));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/oral-scan/records:
 *   post:
 *     summary: Create oral scan record
 *     description: Create oral scan record
 *     tags: ['oral-scan/records']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/schemas/oralScanRecord/createRequest'
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
    const files = req.files as UploadFile[];

    await db.transaction(async trx => {
      const record = await OralScanRecord.query(trx).insert({
        id: req.preGenId,
        date: getNowDate(),
        patientId
      });

      await Promise.all(files.map(async file => {
        const meta = getFileMeta(file);
        await OralScanFile.query(trx).insert({
          id: file.uuid,
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
