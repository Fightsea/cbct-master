declare global {
  type UploadFile = Express.Multer.File & { uuid: string };

  type FileMeta = {
    filename: string;
    originalname: string;
    mimetype: string;
    path: string;
    size: number;
  }
}

export {};
