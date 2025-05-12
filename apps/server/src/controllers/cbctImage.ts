import { Request, NextFunction } from 'express';
import { success } from '@/utils/response';
import db from '@/db';
import { CbctImage } from '@/db/models';
import { deleteFile } from '@/utils/s3';

/**
 * @preserve
 * @swagger
 * /api/cbct/images/{id}:
 *   delete:
 *     summary: Delete cbct image
 *     description: Delete cbct image
 *     tags: ['cbct/images']
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
 *           - `NOT_FOUND`: Image not found.
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

    const image = await CbctImage.query(db).findById(id);
    if (!image) throw new Error('NOT_FOUND');

    await db.transaction(async trx => {
      await CbctImage.query(trx).deleteById(id);

      await deleteFile(image.path);
    });

    return res.json(success('DELETE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
