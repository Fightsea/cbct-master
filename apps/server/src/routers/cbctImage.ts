import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { destroy } from '@/controllers/cbctImage';
import { deleteValidation } from '@/validations/cbctImage';

const router = Router();

router.delete('/:id', validationMiddleware(deleteValidation), destroy);

export default router;
