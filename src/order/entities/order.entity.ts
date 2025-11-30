import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import { User } from '@/user/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('order')
export class Order {
  @ApiProperty({
    description: 'Unique order identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiPropertyOptional({
    description: 'Order items',
    type: () => [OrderItem],
  })
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.Pending,
  })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  orderStatus: OrderStatus;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.OnlinePayment,
  })
  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.Pending,
  })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Delivery method',
    enum: DeliveryMethod,
    example: DeliveryMethod.Express,
  })
  @Column({ type: 'enum', enum: DeliveryMethod, nullable: true })
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    description: 'Total order price',
    example: 2599.98,
  })
  @Column({ type: 'numeric', default: 0, nullable: false })
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'Payment authority code from payment gateway',
    example: 'A000000000000000000000000000000000000',
  })
  @Column({ nullable: true })
  paymentAuthority: string;

  @ApiPropertyOptional({
    description: 'Payment reference ID after verification',
    example: '123456789',
  })
  @Column({ nullable: true })
  paymentRefId: string;

  @ApiPropertyOptional({
    description: 'Transportation tracking code',
    example: 'IR123456789',
  })
  @Column({ nullable: true })
  trackingCode: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Order last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
