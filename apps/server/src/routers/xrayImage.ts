import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { destroy } from '@/controllers/xrayImage';
import { deleteValidation } from '@/validations/xrayImage';

const router = Router();

router.delete('/:id', validationMiddleware(deleteValidation), destroy);

export default router;
