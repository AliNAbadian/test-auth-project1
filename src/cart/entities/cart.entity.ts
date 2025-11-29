import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @ApiProperty({
    description: 'Unique cart identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiPropertyOptional({
    description: 'Cart items',
    type: () => [CartItem],
  })
  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @ApiProperty({
    description: 'Total cart price',
    example: 2599.98,
  })
  @Column({ default: 0 })
  totalPrice: number;
}
