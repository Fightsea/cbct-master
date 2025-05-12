import { Router, RequestHandler } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { create, getAiOutput, getById, getRecords } from '@/controllers/cbctRecord';
import {
  getRecordsValidation,
  getByIdValidation,
  getAiOutputValidation,
  createValidation
} from '@/validations/cbctRecord';
import patientGuarder from '@/middlewares/patientGuarder';
import { multiUploadWithPreGenId } from '@/middlewares/upload';
import { cbctImageFilter } from '@/utils/upload';

const router = Router();
const imageUpload = multiUploadWithPreGenId({
  key: 'images',
  directory: req => `patient/cbct/${req.preGenId}/input`,
  fileFilter: cbctImageFilter,
  minLength: 1
});

router.get(
  '/',
  validationMiddleware(getRecordsValidation),
  patientGuarder('query', 'patientId'),
  getRecords
);
router.get('/:id', validationMiddleware(getByIdValidation), getById);
router.get('/:id/ai-output', validationMiddleware(getAiOutputValidation), getAiOutput);
router.post(
  '/',
  imageUpload as RequestHandler[],
  validationMiddleware(createValidation),
  patientGuarder('body', 'patientId'),
  create
);

export default router;
