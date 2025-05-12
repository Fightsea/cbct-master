import { Request, Response, NextFunction } from 'express';
import { thirdPartyAuthMiddleware } from './jwtAuth';
import { BadRequestError } from '@/utils/error';

const idChecker = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = req.user as unknown as ThirdPartyJwt;
  const { id } = req.params;

  if (user.id !== id) {
    throw new BadRequestError('INVALID_ID');
  }

  next();
};

export const cbctAiOutputAuthMiddleware = [
  thirdPartyAuthMiddleware,
  idChecker
];
