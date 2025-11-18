import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const folder = file.fieldname === 'thumbnail' ? 'thumbnails' : 'gallery';

      const uploadPath = join(process.cwd(), 'uploads', 'products', folder);

      // create folder if missing
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
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
