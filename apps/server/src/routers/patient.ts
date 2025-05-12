import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import {
  searchWithPaging,
  getById,
  getAvatar,
  getHistory,
  getOsaRisk,
  create,
  update,
  switchStatus,
  getNewSerialNumber,
  updatePinned
} from '@/controllers/patient';
import {
  searchWithPagingValidation,
  getByIdValidation,
  getAvatarValidation,
  getHistoryValidation,
  getOsaRiskValidation,
  createValidation,
  updateValidation,
  switchStatusValidation,
  updatePinnedValidation
} from '@/validations/patient';
import pg from '@/middlewares/patientGuarder';
import clinicGuarder from '@/middlewares/clinicGuarder';

const router = Router();
const patientGuarder = pg('params', 'id');

router.get(
  '/',
  validationMiddleware(searchWithPagingValidation),
  clinicGuarder,
  searchWithPaging
);
router.get('/new-sn', getNewSerialNumber);
router.get(
  '/:id',
  validationMiddleware(getByIdValidation),
  patientGuarder,
  getById
);
router.get(
  '/:id/avatar',
  validationMiddleware(getAvatarValidation),
  patientGuarder,
  getAvatar
);
router.get(
  '/:id/history',
  validationMiddleware(getHistoryValidation),
  patientGuarder,
  getHistory
);
router.get(
  '/:id/osa-risk',
  validationMiddleware(getOsaRiskValidation),
  patientGuarder,
  getOsaRisk
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
  patientGuarder,
  update
);
router.put(
  '/:id/status',
  validationMiddleware(switchStatusValidation),
  patientGuarder,
  switchStatus
);
router.put(
  '/:id/pinned',
  validationMiddleware(updatePinnedValidation),
  patientGuarder,
  updatePinned
);

export default router;
