import { Request, NextFunction } from 'express';
import { success } from '@/utils/response';
import db from '@/db';
import { OralScanFile } from '@/db/models';
import { deleteFile } from '@/utils/s3';

/**
 * @preserve
 * @swagger
 * /api/oral-scan/files/{id}:
 *   delete:
 *     summary: Delete oral scan file
 *     description: Delete oral scan file
 *     tags: ['oral-scan/files']
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
 *           - `NOT_FOUND`: File not found.
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

    const file = await OralScanFile.query(db).findById(id);
    if (!file) throw new Error('NOT_FOUND');

    await db.transaction(async trx => {
      await OralScanFile.query(trx).deleteById(id);

      await deleteFile(file.path);
    });

    return res.json(success('DELETE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
