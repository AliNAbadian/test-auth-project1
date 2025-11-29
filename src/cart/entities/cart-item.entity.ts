import { ApiProperty } from '@nestjs/swagger';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @ApiProperty({
    description: 'Unique cart item identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;

  @ApiProperty({
    description: 'Quantity in cart',
    example: 2,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    description: 'Price at the time of adding to cart',
    example: 1299.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
