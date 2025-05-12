import { Request, NextFunction } from 'express';
import db from '@/db';
import { CbctRecord, CbctImage, CbctAiOutput, CbctDisplayView } from '@/db/models';
import { success } from '@/utils/response';
import { getFileMeta, uploadFileToS3 } from '@/utils/upload';
import { getNowDate, getNowDatetime } from '@cbct/utils/moment';
import type {
  GetRecordsResponse,
  GetByIdResponse,
  GetAiOutputResponse,
  CreateResponse
} from '@cbct/api/response/cbctRecord';
import {
  assetProviderOrigin,
  convertS3UriToUrl,
  getDirectory,
  getImageUrl
} from '@/utils/media';
import type { GetRecordsRequest, CreateRequest } from '@cbct/api/request/cbctRecord';
import { raw } from 'objection';
import { getFirstFileUrl } from '@/services/cbctAiOuput';
import osaPhenotypingApi from '@/apis/routes/osaPhenotyping';
import { errorlogger } from '@/utils/logger';

/**
 * @preserve
 * @swagger
 * /api/cbct/records:
 *   get:
 *     summary: Get patient cbct records
 *     description: Get patient cbct records
 *     tags: ['cbct/records']
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
 *               $ref: '#/schemas/cbctRecord/getRecordsResponse'
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

    const records = await CbctRecord.query(db)
      .withGraphFetched('[images, views]')
      .modifyGraph('images', qb => qb.select(
        'id',
        raw('originalname').as('name'),
        raw(`CONCAT('${assetProviderOrigin}', '/', path)`).as('url')
      ))
      .modifyGraph('views', qb => qb.select(
        'id',
        raw('resource').as('url')
      ))
      .where('patientId', patientId)
      .orderBy('date', 'desc')
      .select('id', 'date');

    return res.json(success('SUCCESS', records));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/cbct/records/{id}:
 *   get:
 *     summary: Get cbct record by id
 *     description: Get cbct record by id
 *     tags: ['cbct/records']
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
 *               $ref: '#/schemas/cbctRecord/getByIdResponse'
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

    const cbctRecord = await CbctRecord.query(db)
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

    return res.json(success('SUCCESS', cbctRecord));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/cbct/records/{id}/ai-output:
 *   get:
 *     summary: Get cbct ai output by id
 *     description: Get cbct ai output by id
 *     tags: ['cbct/records']
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
 *               $ref: '#/schemas/cbctRecord/getAiOutputResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getAiOutput = async (
  req: Request,
  res: DataResponse<GetAiOutputResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const output = await CbctAiOutput.query(db)
      .where('recordId', id)
      .select(
        'id',
        'date',
        'model',
        'status',
        'risk',
        'phenotype',
        'phenotypeImageUrl',
        'treatmentDescription',
        'treatmentImageUrl',
        'prescription'
      )
      .first();

    return res.json(success('SUCCESS', output ? {
      ...output,
      fileUrl: await getFirstFileUrl(output.id)
    } : null));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/cbct/records:
 *   post:
 *     summary: Create cbct record
 *     description: Create cbct record
 *     tags: ['cbct/records']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/schemas/cbctRecord/createRequest'
 *     responses:
 *       200:
 *         description: |
 *           - `CREATE_SUCCESS`: Create success.
 *           - `CREATE_WITHOUT_VIEWS`: Create success but failed to get views.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/cbctRecord/createResponse'
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
  res: DataResponse<CreateResponse>,
  next: NextFunction
) => {
  try {
    const patientId = req.body.patientId;
    const images = req.files as UploadFile[];

    const record = await db.transaction(async trx => {
      const record = await CbctRecord.query(trx).insert({
        id: req.preGenId,
        date: getNowDate(),
        patientId
      });

      await Promise.all(images.map(async image => {
        const meta = getFileMeta(image);
        await CbctImage.query(trx).insert({
          id: image.uuid,
          recordId: record.id,
          ...meta
        });

        await uploadFileToS3(meta.path);
      }));

      return record;
    });

    // Get display views from OSA Phenotyping API
    let getViewsSuccess = true;
    await osaPhenotypingApi.getDisplayViewUrls({
      user_id: `${record.id}_${record.patientId}`,
      image: `s3://${process.env.S3_BUCKET}/patient/cbct/${record.id}/input/`
    }).then(urls => Promise.all(urls.map(url => CbctDisplayView.query(db).insert({
      resource: convertS3UriToUrl(url),
      recordId: record.id
    })))).catch((e: any) => {
      getViewsSuccess = false;

      errorlogger.error({ message: {
        time: getNowDatetime(),
        method: req.method,
        url: req.url,
        status: '500',
        error: e,
        message: e.message,
        user: req?.user || 'NONE',
        headers: req.headers,
        query: req.url,
        body: req.body
      } });
    });

    return res.json(success(
      getViewsSuccess ? 'CREATE_SUCCESS' : 'CREATE_WITHOUT_VIEWS',
      { id: record.id }
    ));
  } catch (e) {
    next(e);
  }
};
