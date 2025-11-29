import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus, PaymentMethod, DeliveryMethod } from '../../types';

// ==================== ORDER ITEM DTOs ====================

export class OrderProductInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  title: string;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg' })
  thumbnail?: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: OrderProductInfoDto })
  product: OrderProductInfoDto;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1299.99, description: 'Price at time of order' })
  price: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;
}

// ==================== ORDER RESPONSES ====================

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Pending })
  orderStatus: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.OnlinePayment })
  paymentMethod?: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({ enum: DeliveryMethod, example: DeliveryMethod.Express })
  deliveryMethod?: DeliveryMethod;

  @ApiProperty({ example: 2599.98 })
  totalPrice: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class CreateOrderResponseDto {
  @ApiProperty({ type: OrderResponseDto })
  order: OrderResponseDto;

  @ApiPropertyOptional({ description: 'Payment URL for online payment' })
  paymentUrl?: string;
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'https://payment.gateway.com/pay/123' })
  paymentUrl: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ example: 2599.98 })
  amount: number;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  orders: OrderResponseDto[];
}

export class DeleteOrderResponseDto {
  @ApiProperty({ example: 'Order deleted successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;
}

