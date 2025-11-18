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
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { multerOptions } from 'src/common/multer/multer.config';

// This custom decorator combines both interceptors cleanly
export const MixedMultipartInterceptor = () =>
  UseInterceptors(
    FileInterceptor('thumbnail', multerOptions), // single file
    FilesInterceptor('gallery', 20, multerOptions), // multiple files
  );

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @MixedMultipartInterceptor()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() thumbnail: Express.Multer.File,
    @UploadedFiles() gallery: Express.Multer.File[],
  ) {
    console.log(gallery);
    return this.productService.create({ ...createProductDto });
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
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
