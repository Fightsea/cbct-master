import { Router, RequestHandler } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { create, getById, getRecords } from '@/controllers/oralScanRecord';
import {
  getByIdValidation,
  getRecordsValidation,
  createValidation
} from '@/validations/oralScanRecord';
import patientGuarder from '@/middlewares/patientGuarder';
import { multiUploadWithPreGenId } from '@/middlewares/upload';
import { oralScanFileFilter } from '@/utils/upload';

const router = Router();
const fileUpload = multiUploadWithPreGenId({
  key: 'files',
  directory: req => `patient/oral-scan/${req.preGenId}/input`,
  fileFilter: oralScanFileFilter,
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
  fileUpload as RequestHandler[],
  validationMiddleware(createValidation),
  patientGuarder('body', 'patientId'),
  create
);

export default router;
