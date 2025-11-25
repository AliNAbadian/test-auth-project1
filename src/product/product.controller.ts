import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { multerOptions } from 'src/common/multer/multer.config';

import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { GalleryService } from 'src/gallery/gallery.service';

export const ProductUploadInterceptor = () =>
  UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
      ],
      multerOptions,
    ),
  );

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly galleryService: GalleryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ProductUploadInterceptor()
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
    },
    @Req() req,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const thumbnail = files?.thumbnail?.[0];

    const thumbnailUrl = thumbnail
      ? `${baseUrl}/uploads/products/thumbnails/${thumbnail.filename}`
      : undefined;

    return this.productService.create({
      ...dto,
      thumbnail: thumbnailUrl,
    });
  }

  @Post(':id/gallery')
  @UseInterceptors(FilesInterceptor('gallery', 20, multerOptions))
  async uploadGallery(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.galleryService.uploadGalleryImages(id, files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
