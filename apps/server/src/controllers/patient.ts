import { Request, NextFunction } from 'express';
import db from '@/db';
import { CbctAiOutput, Patient, PatientPhoto, PatientTag } from '@/db/models';
import { success } from '@/utils/response';
import { NotFoundError } from '@/utils/error';
import type {
  SearchWithPagingRequest,
  CreateRequest,
  UpdateRequest,
  SwitchStatusRequest,
  UpdatePinnedRequest
} from '@cbct/api/request/patient';
import type {
  SearchWithPagingResponse,
  GetNewSerialNumberResponse,
  GetByIdResponse,
  GetAvatarResponse,
  GetHistoryResponse,
  GetOsaRiskResponse,
  CreateResponse
} from '@cbct/api/response/patient';
import { fn, ref, raw } from 'objection';
import { PatientPhotoType } from '@cbct/enum/patientPhoto';
import { getImageUrl } from '@/utils/media';
import { DiagnosisAnalysis } from '@/db/views';
import { CbctAiOutputStatus } from '@cbct/enum/cbct';
import { generateSerialNumber } from '@/services/patient';
import { calculateBmi } from '@cbct/utils/math';

/**
 * @preserve
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get patients
 *     description: Get patients
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/sort'
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: ['serialNumber', 'treatmentStatus', 'name', 'osaRisk', 'note', 'createdAt']
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/patient/searchWithPagingResponse'
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `CLINIC_ID_REQUIRED`: Need affiliated clinic id.
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const searchWithPaging = async (
  req: QueryRequest<SearchWithPagingRequest>,
  res: DataResponse<SearchWithPagingResponse>,
  next: NextFunction
) => {
  try {
    const clinicId = req.clinicId!;
    const {
      search = '',
      page,
      size,
      order,
      sort,
      treatmentStatus
    } = req.query;
    const like = `%${search}%`;

    const patients = await Patient.query(db)
      .withGraphFetched('tags')
      .modifyGraph('tags', qb => qb.select('name', 'color'))
      .where('clinicId', clinicId)
      .where('treatmentStatus', treatmentStatus)
      .where(qb => qb
        .whereILike('serialNumber', like)
        .orWhereILike('firstName', like)
        .orWhereILike('lastName', like)
        .orWhereILike('note', like)
      )
      .select(
        'id',
        'pinned',
        'serialNumber',
        'treatmentStatus',
        fn.concat(
          ref('firstName'),
          raw('\' \''),
          ref('lastName')
        ).as('name'),
        Patient.relatedQuery('cbctRecords')
          .joinRelated('output')
          .select('output.risk')
          .where('output.status', CbctAiOutputStatus.COMPLETED)
          .orderBy('output.date', 'desc')
          .limit(1)
          .as('osaRisk'),
        'note',
        'createdAt'
      )
      .orderBy('pinned', 'desc')
      .orderBy(order, sort, 'last')
      .orderBy('createdAt', 'asc')
      .page(page - 1, size);

    return res.json(success('SUCCESS', {
      ...patients,
      search,
      page,
      size,
      order,
      sort
    }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/new-sn:
 *   get:
 *     summary: Generate new patient serial number
 *     description: Generate new patient serial number
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/patient/getNewSerialNumberResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getNewSerialNumber = async (
  req: Request,
  res: DataResponse<GetNewSerialNumberResponse>,
  next: NextFunction
) => {
  try {
    const serialNumber = await generateSerialNumber();

    return res.json(success('SUCCESS', serialNumber));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by id
 *     description: Get patient by id
 *     tags: ['patients']
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
 *               $ref: '#/schemas/patient/getByIdResponse'
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

    const patient = await Patient.query(db)
      .withGraphFetched('tags')
      .modifyGraph('tags', qb => qb.select('tags.id', 'name', 'color'))
      .where('id', id)
      .first()
      .then(p => p ? ({ ...p, bmi: calculateBmi(p.height, p.weight) }) : null);

    return res.json(success('SUCCESS', patient));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}/avatar:
 *   get:
 *     summary: Get patient avatar
 *     description: Get patient avatar
 *     tags: ['patients']
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
 *               $ref: '#/schemas/patient/getAvatarResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getAvatar = async (
  req: Request,
  res: DataResponse<GetAvatarResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const photo = await PatientPhoto.query(db)
      .where('patientId', id)
      .where('type', PatientPhotoType.FRONT)
      .first();

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
 * /api/patients/{id}/history:
 *   get:
 *     summary: Get patient diagnosis or analysis history
 *     description: Get patient diagnosis or analysis history
 *     tags: ['patients']
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
 *               $ref: '#/schemas/patient/getHistoryResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getHistory = async (
  req: Request,
  res: DataResponse<GetHistoryResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const histories = await DiagnosisAnalysis.query(db)
      .withGraphFetched('tags')
      .modifyGraph('tags', qb => qb.select('name', 'color'))
      .where('patientId', id)
      .orderBy('date', 'desc')
      .orderBy('createdAt', 'desc')
      .select('id', 'date', 'type', 'subject', 'description');

    return res.json(success('SUCCESS', histories));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}/osa-risk:
 *   get:
 *     summary: Get patient osa risk
 *     description: Get patient osa risk
 *     tags: ['patients']
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
 *               $ref: '#/schemas/patient/getOsaRiskResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getOsaRisk = async (
  req: Request,
  res: DataResponse<GetOsaRiskResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const output = await CbctAiOutput.query(db)
      .joinRelated('record')
      .where('record.patientId', id)
      .where('status', CbctAiOutputStatus.COMPLETED)
      .orderBy('date', 'desc')
      .first();

    return res.json(success('SUCCESS', output?.risk || null));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create patient
 *     description: Create patient
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/patient/createRequest'
 *     responses:
 *       200:
 *         description: |
 *           - `CREATE_SUCCESS`: Create patient success.
 *           - `SN_REGENERATED`: Serial number is regenerated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/patient/createResponse'
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `CLINIC_ID_REQUIRED`: Need affiliated clinic id.
 *           - `SN_NOT_LATEST`: Serial number is not latest.
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
    const clinicId = req.clinicId!;
    const { tagIds, ...body } = req.body;

    const { patient, serialNumber } = await db.transaction(async trx => {
      // Generate serial number
      const serialNumber = await generateSerialNumber(trx);

      // Create patient
      const patient = await Patient.query(trx).insert({
        ...body,
        serialNumber,
        clinicId
      });

      // Create patient tags
      await Promise.all(tagIds.map(id => PatientTag.query(trx).insert({
        patientId: patient.id,
        tagId: id
      })));

      return { patient, serialNumber };
    });

    return res.json(success(body.serialNumber !== serialNumber ? 'SN_REGENERATED' : 'CREATE_SUCCESS', {
      id: patient.id,
      serialNumber
    }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient
 *     description: Update patient
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/patient/updateRequest'
 *     responses:
 *       200:
 *         description: "`UPDATE_SUCCESS`"
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const update = async (
  req: BodyRequest<UpdateRequest>,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const clinicId = req.clinicId!;
    const id = req.params.id;
    const { tagIds, ...body } = req.body;

    await db.transaction(async trx => {
      // Update patient
      await Patient.query(trx).patch({ ...body, clinicId }).where('id', id);

      // Delete all old patient tags
      await PatientTag.query(trx).where('patientId', id).delete();

      // Insert new patient tags
      await Promise.all(tagIds.map(tagId => PatientTag.query(trx).insert({
        patientId: id,
        tagId
      })));
    });

    return res.json(success('UPDATE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}/status:
 *   put:
 *     summary: Update patient treatment status
 *     description: Update patient treatment status
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/patient/switchStatusRequest'
 *     responses:
 *       200:
 *         description: "`SWITCH_SUCCESS`"
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const switchStatus = async (
  req: BodyRequest<SwitchStatusRequest>,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { treatmentStatus } = req.body;

    await Patient.query(db)
      .patch({ treatmentStatus })
      .where('id', id);

    return res.json(success('SWITCH_SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/patients/{id}/pinned:
 *   put:
 *     summary: Switch patient pinned
 *     description: Switch patient pinned
 *     tags: ['patients']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/patient/updatePinnedRequest'
 *     responses:
 *       200:
 *         description: "`UPDATE_SUCCESS`"
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       403:
 *         description: "`FORBIDDEN`: Forbidden."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const updatePinned = async (
  req: BodyRequest<UpdatePinnedRequest>,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { pinned } = req.body;

    await Patient.query(db)
      .patch({ pinned })
      .where('id', id);

    return res.json(success('UPDATE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
