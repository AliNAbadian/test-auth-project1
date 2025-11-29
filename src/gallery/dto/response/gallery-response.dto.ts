import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';

export class GalleryWithProductDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'http://localhost:8000/uploads/products/gallery/123.jpg' })
  url: string;

  @ApiProperty({ type: () => Product, description: 'Product this image belongs to' })
  product: Product;
}

