import { Request, NextFunction } from 'express';
import { User } from '@/db/models';
import { UnauthorizedError } from '@/utils/error';
import type { LoginRequest } from '@cbct/api/request/auth';
import type {
  LoginResponse,
  RefreshTokenResponse
} from '@cbct/api/response/auth';
import db from '@/db';
import { success } from '@/utils/response';
import { compareSync } from '@/utils/bcrypt';
import { genAccessToken, genRefreshToken } from '@/utils/jwt';
import { getAffiliatedClinics } from '@/services/user';

/**
 * @preserve
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user.
 *     description: Validates user credentials.
 *     tags: ['auth']
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/auth/loginRequest'
 *     responses:
 *       200:
 *         description: "`LOGIN_SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/auth/loginResponse'
 *       400:
 *         description: "`VALIDATION_ERROR`: Inputs validation error."
 *       401:
 *         description: "`LOGIN_FAILED`: Email and password is wrong."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const login = async (
  req: BodyRequest<LoginRequest>,
  res: DataResponse<LoginResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.query(db)
      .whereNotDeleted()
      .where('email', email)
      .first()
      .select();

    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedError('LOGIN_FAILED');
    }

    return res.json(success('LOGIN_SUCCESS', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        clinics: await getAffiliatedClinics(user.id)
      },
      accessToken: genAccessToken(user),
      refreshToken: genRefreshToken(user)
    }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/auth/token/refresh:
 *   post:
 *     summary: Refresh token.
 *     description: Refresh token.
 *     tags: ['auth']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "`REFRESH_SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/auth/refreshTokenResponse'
 *       401:
 *         description: "`UNAUTHORIZED`: Token is invalid or user not found."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const refreshToken = async (
  req: Request,
  res: DataResponse<RefreshTokenResponse>,
  next: NextFunction
) => {
  try {
    const user = await User.query(db)
      .whereNotDeleted()
      .findById(req.user!.id)
      .select();

    if (!user) {
      throw new UnauthorizedError('UNAUTHORIZED');
    }

    return res.json(success('REFRESH_SUCCESS', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        clinics: await getAffiliatedClinics(user.id)
      },
      accessToken: genAccessToken(user),
      refreshToken: genRefreshToken(user)
    }));
  } catch (e) {
    next(e);
  }
};

/**
 * @preserve
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout server.
 *     description: Logout server.
 *     tags: ['auth']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "`LOGOUT_SUCCESS`"
 *       401:
 *         description: "`UNAUTHORIZED`: Token is invalid."
 *       500:
 *         description: "`INTERNAL_SERVER_ERROR`: Unexpected condition was encountered."
 */
export const logout = async (
  _: Request,
  res: NoDataResponse,
  next: NextFunction
) => {
  try {
    return res.json(success('LOGOUT_SUCCESS'));
  } catch (e) {
    next(e);
  }
};
