import { Request, NextFunction } from 'express';
import db from '@/db';
import { CbctAiOutput, CbctDisplayView, CbctImage } from '@/db/models';
import { success } from '@/utils/response';
import { GetInputImagesResponse } from '@cbct/api/response/cbctAiOutput';
import { CreateRequest, CompleteRequest } from '@cbct/api/request/cbctAiOutput';
import { CbctAiOutputStatus } from '@cbct/enum/cbct';
import { getNowDate, getNowDatetime } from '@cbct/utils/moment';
import { analyze, convertAnalyzeResult, destroy as deleteAiOutput } from '@/services/cbctAiOuput';
import { InternalServerError } from '@/utils/error';
import { assetProviderOrigin } from '@/utils/media';
import { raw } from 'objection';
import { errorlogger } from '@/utils/logger';

/**
 * @preserve
 * @swagger
 * /api/cbct/ai-outputs/{id}/images/input:
 *   get:
 *     summary: Get CBCT input images
 *     description: Get CBCT input images
 *     tags: ['cbct/ai-outputs']
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
 *               $ref: '#/schemas/cbctAiOutput/getInputImagesResponse'
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const getInputImages = async (
  req: Request,
  res: DataResponse<GetInputImagesResponse>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const urls: Url[] = [];
    let count = 0;

    const views = await CbctDisplayView.query(db)
      .where('recordId', CbctAiOutput.query(db).findById(id).select('recordId'))
      .select('resource');

    if (!views.length) {
      const images = await CbctImage.query(db)
        .where('recordId', CbctAiOutput.query(db).findById(id).select('recordId'))
        .select(raw('CONCAT(?::text, ?::text, path) as url', [assetProviderOrigin, '/']))
        .orderBy('createdAt', 'asc')
        .page(0, 4)
        .castTo<{
          results: Array<{ url: Url }>;
          total: number;
        }>();

      urls.push(...images.results.map(image => image.url));
      count = images.total;
    } else {
      urls.push(...views.map(view => view.resource));
      count = views.length;
    }

    return res.json(success('SUCCESS', { urls, count }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/cbct/ai-outputs:
 *   post:
 *     summary: Create CBCT AI analysis & inference output
 *     description: Create CBCT AI analysis & inference output
 *     tags: ['cbct/ai-outputs']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/cbctAiOutput/createRequest'
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
    const { recordId } = req.body;

    const outputId = await db.transaction(async trx => {
      await deleteAiOutput(trx, recordId);

      // Create output
      const output = await CbctAiOutput.query(trx).insert({
        ...req.body,
        date: getNowDate(),
        status: CbctAiOutputStatus.INFERING
      });

      return output.id;
    });

    analyze(outputId).catch(async (e: any) => {
      await CbctAiOutput.query(db)
        .patch({ status: CbctAiOutputStatus.FAILED })
        .where('id', outputId);

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

    return res.json(success('CREATE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/cbct/ai-outputs/{id}/complete:
 *   put:
 *     summary: Complete inference output
 *     description: Complete inference output
 *     tags: ['cbct/ai-outputs']
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/cbctAiOutput/completeRequest'
 *     responses:
 *       200:
 *         description: "`COMPLETE_SUCCESS`"
 *       400:
 *         description: |
 *          - `VALIDATION_ERROR`: Inputs validation error.
 *          - `INVALID_ID`: Invalid ID.
 *       401:
 *         description: "`UNAUTHORIZED`: Unauthorized."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const complete = async (
  req: BodyRequest<CompleteRequest>,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    try {
      await convertAnalyzeResult(id, req.body);
    } catch (e: any) {
      throw new InternalServerError(e.message);
    }

    return res.json(success('COMPLETE_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
