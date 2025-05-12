import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import path from 'path';
import { BadRequestError } from './error';
import { deleteFile, deleteFiles } from './file';
import { uploadFile } from './s3';

const imageValidTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const imageFileFilter = (
  _req: Request,
  file: UploadFile,
  cb: FileFilterCallback
) => {
  if (imageValidTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('MIMETYPE_ERROR'));
  }
};

const extFilter = (ext: string) => (
  _req: Request,
  file: UploadFile,
  cb: FileFilterCallback
) => {
  const originalname = file.originalname;
  const extension = originalname.substring(originalname.lastIndexOf('.'), originalname.length);

  if (extension.toLowerCase() === ext) {
    cb(null, true);
  } else {
    cb(new BadRequestError('MIMETYPE_ERROR'));
  }
};

export const oralScanFileFilter = extFilter('.stl');

export const cbctImageFilter = extFilter('.dcm');

export const getFileMeta = (file: UploadFile): FileMeta => ({
  filename: file.filename,
  originalname: file.originalname,
  mimetype: file.mimetype,
  path: file.path.split('uploads')[1].substring(1).replace(/\\/g, '/'),
  size: file.size
});

export const removeUploadFiles = (
  singleUploadFile: UploadFile | undefined,
  multiUploadFiles: UploadFile[] | undefined
) => {
  if (singleUploadFile) {
    deleteFile(singleUploadFile.path);
  }

  if (multiUploadFiles) {
    deleteFiles(multiUploadFiles.map(file => file.path));
  }
};

export const uploadFileToS3 = async (key: string) => {
  const filePath = path.join(__dirname, '../uploads/' + key);
  await uploadFile(key, filePath);
  deleteFile(filePath);
};
