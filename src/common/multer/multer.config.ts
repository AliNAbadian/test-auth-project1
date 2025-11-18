// src/common/multer/multer.config.ts
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const path =
        file.fieldname === 'thumbnail'
          ? './uploads/products/thumbnails'
          : './uploads/products/gallery';
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/.*/.test(file.mimetype)) cb(null, true);
    else cb(new BadRequestException('Only images allowed'), false);
  },
};
