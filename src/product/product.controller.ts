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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
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

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly galleryService: GalleryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'iPhone 15 Pro Max' },
        quantity: { type: 'number', example: 100 },
        price: { type: 'number', example: 1299.99 },
        color: { type: 'string', example: 'Titanium Black' },
        dimensions: { type: 'string', example: '159.9 x 76.7 x 8.25 mm' },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Product thumbnail image',
        },
      },
      required: ['title', 'quantity', 'price'],
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Product with same name exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Upload gallery images for a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        gallery: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Gallery image files (max 20)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Gallery images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Product not found or no files uploaded' })
  @UseInterceptors(FilesInterceptor('gallery', 20, multerOptions))
  async uploadGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.galleryService.uploadGalleryImages(id, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Returns all products with gallery' })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Returns product details with gallery' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
