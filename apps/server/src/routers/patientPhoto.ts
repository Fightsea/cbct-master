import { Router, RequestHandler } from 'express';
import validationMiddleware from '@/middlewares/validation';
import {
  getPhotos,
  getTagged,
  upload,
  switchType,
  destroy
} from '@/controllers/patientPhoto';
import {
  getPhotosValidation,
  getTaggedValidation,
  uploadValidation,
  switchTypeValidation,
  deleteValidation
} from '@/validations/patientPhoto';
import patientGuarder from '@/middlewares/patientGuarder';
import { multiUpload } from '@/middlewares/upload';
import { imageFileFilter } from '@/utils/upload';

const imageUpload = multiUpload({
  key: 'images',
  directory: 'patient/photo',
  fileFilter: imageFileFilter,
  minLength: 1
});

const router = Router();
const guarder = patientGuarder('body', 'patientId');

router.get('/:patientId', validationMiddleware(getPhotosValidation), getPhotos);
router.get('/:patientId/tagged', validationMiddleware(getTaggedValidation), getTagged);
router.post(
  '/',
  imageUpload as RequestHandler[],
  validationMiddleware(uploadValidation),
  guarder,
  upload
);
router.put('/:id/type', validationMiddleware(switchTypeValidation), switchType);
router.delete('/:id', validationMiddleware(deleteValidation), destroy);

export default router;
