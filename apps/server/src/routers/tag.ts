import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import {
  create,
  update,
  destroy,
  getByClinic
} from '@/controllers/tag';
import {
  getByClinicValidation,
  createValidation,
  updateValidation,
  deleteValidation
} from '@/validations/tag';
import clinicGuarder from '@/middlewares/clinicGuarder';

const router = Router();

router.get(
  '/',
  validationMiddleware(getByClinicValidation),
  clinicGuarder,
  getByClinic
);
router.post(
  '/',
  validationMiddleware(createValidation),
  clinicGuarder,
  create
);
router.put(
  '/:id',
  validationMiddleware(updateValidation),
  clinicGuarder,
  update
);
router.delete(
  '/:id',
  validationMiddleware(deleteValidation),
  clinicGuarder,
  destroy
);

export default router;
