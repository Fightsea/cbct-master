import { Request, Response, NextFunction } from 'express';
import redis from '@/utils/redis';

const redisMiddleware = async (req: Request, _: Response, next: NextFunction) => {
  req.redis = redis;

  next();
};

export default redisMiddleware;
