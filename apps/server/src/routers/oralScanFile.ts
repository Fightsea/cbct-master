import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { destroy } from '@/controllers/oralScanFile';
import { deleteValidation } from '@/validations/oralScanFile';

const router = Router();

router.delete('/:id', validationMiddleware(deleteValidation), destroy);

export default router;
