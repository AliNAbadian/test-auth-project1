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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
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
  PaginatedProductsResponseDto,
} from './dto/response/product-response.dto';
import { Roles } from '@/auth/decorator/role.decorator';
import { Role } from '@/auth/enum/role.enum';

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
    description:
      'Create a new product with optional thumbnail image. Requires authentication.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'iPhone 15 Pro Max',
          description: 'Product title',
        },
        quantity: {
          type: 'number',
          example: 100,
          description: 'Stock quantity',
        },
        price: {
          type: 'number',
          example: 1299.99,
          description: 'Product price',
        },
        color: {
          type: 'string',
          example: 'Titanium Black',
          description: 'Product color (optional)',
        },
        dimensions: {
          type: 'string',
          example: '159.9 x 76.7 x 8.25 mm',
          description: 'Product dimensions (optional)',
        },
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
  @ApiResponse({
    status: 400,
    description: 'Product with same name exists',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ProductUploadInterceptor()
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Req() req,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const thumbnail = files?.thumbnail?.[0];
    const gallery = files?.gallery;

    console.log(gallery);

    const thumbnailUrl = thumbnail
      ? `${baseUrl}/uploads/products/thumbnails/${thumbnail.filename}`
      : undefined;

    return this.productService.create({
      ...dto,
      thumbnail: thumbnailUrl,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/gallery/:galleryId')
  @ApiOperation({
    summary: 'Upload gallery images for a product',
    description: 'Upload up to 20 gallery images for a product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
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
    status: 200,
    description: 'Gallery images deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Product not found or no files uploaded',
    type: ErrorResponseDto,
  })
  @UseInterceptors(FilesInterceptor('gallery', 20, multerOptions))
  async deleteGallery(
    @Param('id') id: string,
    @Param('galleryId') galleryId: string,
  ) {
    return this.galleryService.remove(galleryId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/gallery')
  @ApiOperation({
    summary: 'Upload gallery images for a product',
    description: 'Upload up to 20 gallery images for a product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
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
  @ApiResponse({
    status: 400,
    description: 'Product not found or no files uploaded',
    type: ErrorResponseDto,
  })
  @UseInterceptors(FilesInterceptor('gallery', 20, multerOptions))
  async uploadGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.galleryService.uploadGalleryImages(id, files);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with filters and pagination',
    description:
      'Returns paginated products with optional filters: search, price range, color, stock status, and sorting',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by product title or slug',
    example: 'iPhone',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
    example: 20,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
    example: 1000,
  })
  @ApiQuery({
    name: 'color',
    required: false,
    type: String,
    description: 'Filter by color',
    example: 'Black',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    type: Boolean,
    description: 'Filter only products in stock (quantity > 0)',
    example: true,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'title', 'created_at'],
    description: 'Sort field (default: created_at)',
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order (default: DESC)',
    example: 'ASC',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated products with gallery',
    type: PaginatedProductsResponseDto,
  })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('color') color?: string,
    @Query('inStock') inStock?: string | boolean,
    @Query('sortBy') sortBy?: 'price' | 'title' | 'created_at',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    // Convert inStock query param to boolean
    let inStockBool: boolean | undefined = undefined;
    if (inStock !== undefined) {
      if (typeof inStock === 'boolean') {
        inStockBool = inStock;
      } else if (typeof inStock === 'string') {
        inStockBool = inStock.toLowerCase() === 'true';
      }
    }

    return this.productService.findAll(
      search,
      page,
      limit,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      color,
      inStockBool,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Returns a single product with its gallery images',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns product details with gallery',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ProductUploadInterceptor()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update product information',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Req() req,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[] },
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const thumbnail = files?.thumbnail?.[0];

    const thumbnailUrl = thumbnail
      ? `${baseUrl}/uploads/products/thumbnails/${thumbnail.filename}`
      : undefined;

    return this.productService.update(id, {
      ...updateProductDto,
      thumbnail: thumbnailUrl,
    });
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Permanently delete a product and its gallery',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
