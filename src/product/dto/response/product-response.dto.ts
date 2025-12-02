import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== GALLERY DTO ====================

export class GalleryImageDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'http://localhost:8000/uploads/products/gallery/123.jpg' })
  url: string;
}

// ==================== PRODUCT RESPONSES ====================

export class ProductResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  title: string;

  @ApiProperty({ example: 'iphone-15-pro-max' })
  slug: string;

  @ApiPropertyOptional({ example: 'Titanium Black' })
  color?: string;

  @ApiPropertyOptional({ example: '159.9 x 76.7 x 8.25 mm' })
  dimensions?: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg' })
  thumbnail?: string;

  @ApiProperty({ type: [GalleryImageDto] })
  gallery: GalleryImageDto[];

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class CreateProductResponseDto extends ProductResponseDto {}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number', example: 100 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 20 },
      totalPages: { type: 'number', example: 5 },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class GalleryUploadResponseDto {
  @ApiProperty({ type: [GalleryImageDto] })
  uploadedImages: GalleryImageDto[];
}

export class DeleteProductResponseDto {
  @ApiProperty({ example: 'Product deleted successfully' })
  message: string;
}

export class UpdateProductResponseDto extends ProductResponseDto {}

