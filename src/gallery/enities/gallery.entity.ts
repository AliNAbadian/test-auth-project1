import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity('gallery')
export class Gallery {
  @ApiProperty({
    description: 'Unique gallery image identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'http://localhost:8000/uploads/products/gallery/123.jpg',
  })
  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.gallery, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
