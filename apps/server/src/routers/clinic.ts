import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { createValidation, getPhotoValidation } from '@/validations/clinic';
import { getAffiliated, create, getPhoto } from '@/controllers/clinic';
import { singleUpload } from '@/middlewares/upload';
import { imageFileFilter } from '@/utils/upload';

const router = Router();
const imageUpload = singleUpload({
  key: 'image',
  directory: 'clinic/photo',
  fileFilter: imageFileFilter
});

router.get('/affiliated', getAffiliated);
router.get('/:id/photo', validationMiddleware(getPhotoValidation), getPhoto);
router.post(
  '/',
  imageUpload,
  validationMiddleware(createValidation),
  create
);

export default router;
