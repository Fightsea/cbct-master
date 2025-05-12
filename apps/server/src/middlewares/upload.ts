import { NextFunction, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { uuid } from '@/utils/uuid';
import { deleteFile } from '@/utils/file';
import { BadRequestError } from '@/utils/error';

type FileFilter = (
  req: Request,
  file: UploadFile,
  callback: FileFilterCallback,
) => void;

type UploadOptions = {
  key: string;
  directory: string | ((req: Request) => string);
  fileFilter: FileFilter;
  minLength?: number;
  maxLength?: number;
}

const uploadDir = path.join(__dirname, '../uploads/');

export const singleUpload = ({ key, directory, fileFilter }: UploadOptions) => multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      const dir = path.resolve(uploadDir, typeof directory === 'function' ? directory(req) : directory);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename
  }),
  fileFilter
}).single(key);

export const multiUpload = ({
  key,
  directory,
  fileFilter,
  minLength = 0,
  maxLength
}: UploadOptions) => [
  multer({
    storage: multer.diskStorage({
      destination: (req, _file, cb) => {
        const dir = path.resolve(uploadDir, typeof directory === 'function' ? directory(req) : directory);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename
    }),
    fileFilter
  }).array(key, maxLength),
  minUploadLength(minLength)
];

export const multiUploadWithPreGenId = ({
  key,
  directory,
  fileFilter,
  minLength = 0,
  maxLength
}: UploadOptions) => [
  (req: Request, _: Response, next: NextFunction) => {
    req.preGenId = uuid();
    next();
  },
  ...multiUpload({
    key,
    directory,
    fileFilter,
    minLength,
    maxLength
  })
];

const filename = (
  req: Request,
  file: UploadFile,
  cb: (error: Error | null, filename: string) => void
) => {
  const id = uuid();
  file.uuid = id;

  const originalname = file.originalname;
  const extension = originalname.substring(originalname.lastIndexOf('.'), originalname.length);
  const filename = id + extension;

  cb(null, filename);

  req.on('aborted', () => {
    file.stream.on('end', () => deleteFile(uploadDir + filename));
    file.stream.emit('end');
  });
};

const minUploadLength = (min: number) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const filesLength = Array.isArray(req.files) ? req.files.length : 0;

  if (filesLength < min) {
    return next(new BadRequestError('UPLOAD_LENGTH_NOT_ENOUGH'));
  }

  next();
};
