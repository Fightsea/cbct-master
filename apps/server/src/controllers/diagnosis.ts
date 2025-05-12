import { NextFunction } from 'express';
import db from '@/db';
import { success } from '@/utils/response';
import { CreateRequest } from '@cbct/api/request/diagnosis';
import { Diagnosis, DiagnosisTag, User } from '@/db/models';
import { Position } from '@cbct/enum/user';
import { BadRequestError } from '@/utils/error';

/**
 * @preserve
 * @swagger
 * /api/diagnoses:
 *   post:
 *     summary: Create diagnosis
 *     description: Create diagnosis
 *     tags: ['diagnoses']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/diagnosis/createRequest'
 *     responses:
 *       200:
 *         description: "`CREATE_SUCCESS`"
 *       400:
 *         description: |
 *           - `VALIDATION_ERROR`: Inputs validation error.
 *           - `DOCTOR_REQUIRED`: User is not a doctor.
 *           - `PATIENT_ID_REQUIRED`: Need patient id.
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
    const { tagIds, ...body } = req.body;

    // Check user position is doctor
    const isDoctor = await User.query(db)
      .where('id', body.doctorId)
      .where('position', Position.DOCTOR)
      .first();

    if (!isDoctor) {
      throw new BadRequestError('DOCTOR_REQUIRED');
    }

    await db.transaction(async trx => {
      // Create diagnosis
      const diagnosis = await Diagnosis.query(trx).insert(body);

      // Create diagnosis tags
      await Promise.all(tagIds.map(id => DiagnosisTag.query(trx).insert({
        diagnosisId: diagnosis.id,
        tagId: id
      })));
    });

    return res.json(success('CREATE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
