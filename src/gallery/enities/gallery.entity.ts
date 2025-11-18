// gallery.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  // This creates the real foreign key column "productId"
  @ManyToOne(() => Product, (product) => product.gallery, {
    onDelete: 'CASCADE', // optional but recommended
  })
  product: Product;
}
