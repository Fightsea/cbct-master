import { Router } from 'express';
import validationMiddleware from '@/middlewares/validation';
import { login, logout, refreshToken } from '@/controllers/auth';
import { loginValidation } from '@/validations/auth';
import { refreshTokenAuthMiddleware } from '@/middlewares/jwtAuth';

const router = Router();

router.post('/login', validationMiddleware(loginValidation), login);
router.post('/token/refresh', refreshTokenAuthMiddleware, refreshToken);
router.post('/logout', logout);

export default router;
