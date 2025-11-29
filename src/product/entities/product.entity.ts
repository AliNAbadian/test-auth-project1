import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Gallery } from 'src/gallery/enities/gallery.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'iPhone 15 Pro Max',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Product slug (URL-friendly title)',
    example: 'iphone-15-pro-max',
  })
  @Column({ unique: true })
  slug: string;

  @ApiPropertyOptional({
    description: 'Product color',
    example: 'Titanium Black',
  })
  @Column({ nullable: true })
  color: string;

  @ApiPropertyOptional({
    description: 'Product dimensions',
    example: '159.9 x 76.7 x 8.25 mm',
  })
  @Column({ nullable: true })
  dimensions: string;

  @ApiPropertyOptional({
    description: 'Product thumbnail image URL',
    example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg',
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'Product gallery images',
    type: () => [Gallery],
  })
  @OneToMany(() => Gallery, (gallery) => gallery.product, { cascade: true })
  gallery: Gallery[];

  @ApiProperty({
    description: 'Product price',
    example: 1299.99,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false, default: 0 })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product quantity in stock',
    example: 100,
  })
  @Column('int', { default: 0 })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
