import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { complete, create, getInputImages } from '@/controllers/cbctAiOutput';
import {
  getInputImagesValidation,
  createValidation,
  completeValidation
} from '@/validations/cbctAiOutput';
import { cbctAiOutputAuthMiddleware } from '@/middlewares/thirdParty';

const router = Router();

router.get('/:id/images/input', validationMiddleware(getInputImagesValidation), getInputImages);
router.post('/', validationMiddleware(createValidation), create);
router.put('/:id/complete', cbctAiOutputAuthMiddleware, validationMiddleware(completeValidation), complete);

export default router;
