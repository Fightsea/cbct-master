import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { error } from '@/utils/response';
import { ErrorBase } from '@/utils/error';
import { isProd } from '@cbct/utils/system';
import { errorlogger } from '@/utils/logger';
import { getNowDatetime } from '@cbct/utils/moment';
import { removeUploadFiles } from '@/utils/upload';

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response<ErrorHttpResponse>,
  _: NextFunction
) => {
  // Remove all upload images if error occurred
  removeUploadFiles(
    req?.file as UploadFile | undefined,
    req?.files as UploadFile[] | undefined
  );

  if (err instanceof multer.MulterError) {
    return res.status(400).json(error('UPLOAD_ERROR', err.code));
  }

  if (err instanceof ErrorBase) {
    return res.status(err.status).json(error(err.code, err.message));
  }

  // Record error log
  delete req.body.password;
  errorlogger.error({ message: {
    time: getNowDatetime(),
    method: req.method,
    url: req.url,
    status: '500',
    error: err,
    message: err.message,
    user: req?.user || 'NONE',
    headers: req.headers,
    query: req.url,
    body: req.body
  } });

  const msg = isProd ? undefined : err.message;
  return res.status(500).json(error('INTERNAL_SERVER_ERROR', msg));
};

export default errorHandlerMiddleware;
