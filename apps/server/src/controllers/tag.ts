import { Request, NextFunction } from 'express';
import db from '@/db';
import { Tag } from '@/db/models';
import { success } from '@/utils/response';
import { BadRequestError } from '@/utils/error';
import type { CreateRequest, UpdateRequest } from '@cbct/api/request/tag';
import type { CreateResponse, GetByClinicResponse } from '@cbct/api/response/tag';

/**
 * @preserve
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get tags
 *     description: Get tags
 *     tags: ['tags']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *     responses:
 *       200:
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/tag/getByClinicResponse'
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
export const getByClinic = async (
  req: Request,
  res: DataResponse<GetByClinicResponse>,
  next: NextFunction
) => {
  try {
    const clinicId = req.clinicId!;

    const tags = await Tag.query(db)
      .where('clinicId', clinicId)
      .select('id', 'name', 'color');

    return res.json(success('SUCCESS', tags));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create tag
 *     description: Create tag
 *     tags: ['tags']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/tag/createRequest'
 *     responses:
 *       200:
 *         description: "`CREATE_SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/tag/createResponse'
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
export const create = async (
  req: BodyRequest<CreateRequest>,
  res: DataResponse<CreateResponse>,
  next: NextFunction
) => {
  try {
    const clinicId = req.clinicId!;
    const body = req.body;

    const isDuplicate = await Tag.query(db)
      .where('clinicId', clinicId)
      .where('name', body.name)
      .first()
      .then(t => !!t);

    if (isDuplicate) {
      throw new BadRequestError('DUPLICATE_NAME');
    }

    const tag = await Tag.query(db).insert({ ...body, clinicId });

    return res.json(success('CREATE_SUCCESS', { id: tag.id }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update tag
 *     description: Update tag
 *     tags: ['tags']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/tag/updateRequest'
 *     responses:
 *       200:
 *         description: "`UPDATE_SUCCESS`"
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `CLINIC_ID_REQUIRED`: Need affiliated clinic id.
 *           - `DUPLICATE_NAME`: Duplicate name.
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
    const body = req.body;

    const isDuplicate = await Tag.query(db)
      .where('clinicId', clinicId)
      .where('name', body.name)
      .whereNot('id', id)
      .first()
      .then(p => !!p);

    if (isDuplicate) {
      throw new BadRequestError('DUPLICATE_NAME');
    }

    await Tag.query(db).patch(body).where('id', id);

    return res.json(success('UPDATE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete tag
 *     description: Delete tag
 *     tags: ['tags']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/XClinicId'
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: "`DELETE_SUCCESS`"
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
export const destroy = async (
  req: Request,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await Tag.query(db).deleteById(id);

    return res.json(success('DELETE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
