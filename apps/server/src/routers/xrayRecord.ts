import { Router, RequestHandler } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { create, getById, getRecords } from '@/controllers/xrayRecord';
import { createValidation, getByIdValidation, getRecordsValidation } from '@/validations/xrayRecord';
import patientGuarder from '@/middlewares/patientGuarder';
import { multiUploadWithPreGenId } from '@/middlewares/upload';
import { imageFileFilter } from '@/utils/upload';

const router = Router();
const imageUpload = multiUploadWithPreGenId({
  key: 'images',
  directory: req => `patient/xray/${req.preGenId}/input`,
  fileFilter: imageFileFilter,
  minLength: 1
});

router.get(
  '/',
  validationMiddleware(getRecordsValidation),
  patientGuarder('query', 'patientId'),
  getRecords
);
router.get('/:id', validationMiddleware(getByIdValidation), getById);
router.post(
  '/',
  imageUpload as RequestHandler[],
  validationMiddleware(createValidation),
  patientGuarder('body', 'patientId'),
  create
);

export default router;
