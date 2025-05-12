import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { create } from '@/controllers/diagnosis';
import { createValidation } from '@/validations/diagnosis';
import patientGuarder from '@/middlewares/patientGuarder';

const router = Router();
const guarder = patientGuarder('body', 'patientId');

router.post(
  '/',
  validationMiddleware(createValidation),
  guarder,
  create
);

export default router;
