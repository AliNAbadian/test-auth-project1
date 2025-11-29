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
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  ProductResponseDto,
  GalleryImageDto,
} from './dto/response/product-response.dto';

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
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with optional thumbnail image. Requires authentication.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'iPhone 15 Pro Max', description: 'Product title' },
        quantity: { type: 'number', example: 100, description: 'Stock quantity' },
        price: { type: 'number', example: 1299.99, description: 'Product price' },
        color: { type: 'string', example: 'Titanium Black', description: 'Product color (optional)' },
        dimensions: { type: 'string', example: '159.9 x 76.7 x 8.25 mm', description: 'Product dimensions (optional)' },
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Product thumbnail image (optional)',
        },
      },
      required: ['title', 'quantity', 'price'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Product with same name exists', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
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
  @ApiOperation({
    summary: 'Upload gallery images for a product',
    description: 'Upload up to 20 gallery images for a product',
  })
  @ApiParam({ name: 'id', description: 'Product UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
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
  @ApiResponse({
    status: 201,
    description: 'Gallery images uploaded successfully',
    type: [GalleryImageDto],
  })
  @ApiResponse({ status: 400, description: 'Product not found or no files uploaded', type: ErrorResponseDto })
  @UseInterceptors(FilesInterceptor('gallery', 20, multerOptions))
  async uploadGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
) {
    return this.galleryService.uploadGalleryImages(id, files);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Returns all products with their gallery images',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all products with gallery',
    type: [ProductResponseDto],
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Returns a single product with its gallery images',
  })
  @ApiParam({ name: 'id', description: 'Product UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details with gallery',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update product information',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Permanently delete a product and its gallery',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
