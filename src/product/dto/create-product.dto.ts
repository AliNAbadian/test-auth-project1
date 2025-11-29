import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'iPhone 15 Pro Max',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Product quantity in stock',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Product color',
    example: 'Titanium Black',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Product dimensions',
    example: '159.9 x 76.7 x 8.25 mm',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Product thumbnail image URL',
    example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: 'Product price',
    example: 1299.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;
}
