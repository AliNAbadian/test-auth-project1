import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/auth/enum/role.enum';
import { OrderStatus, PaymentStatus, DeliveryMethod } from 'src/order/types';

// ==================== PROFILE RESPONSES ====================

export class UserGalleryItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'http://localhost:8000/uploads/users/gallery/123.jpg' })
  url: string;
}

export class ProfileResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 1234567890 })
  nationalCode?: number;

  @ApiPropertyOptional({ example: 1234567890 })
  postalCode?: number;

  @ApiPropertyOptional({ example: 'تهران، خیابان ولیعصر' })
  address?: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/users/thumbnails/123.jpg' })
  thumbnail?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];

  @ApiProperty({ type: [UserGalleryItemDto] })
  gallery: UserGalleryItemDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class ChangePhoneResponseDto {
  @ApiProperty({ example: 'Phone number updated successfully' })
  message: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;
}

export class DeactivateAccountResponseDto {
  @ApiProperty({ example: 'Account deactivated successfully' })
  message: string;
}

// ==================== ORDER RESPONSES ====================

export class OrderProductDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  title: string;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg' })
  thumbnail?: string;
}

export class OrderItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: OrderProductDto })
  product: OrderProductDto;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1299.99 })
  price: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Pending })
  orderStatus: OrderStatus;

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

export class OrderStatusResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Processing })
  orderStatus: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.Completed })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({ enum: DeliveryMethod, example: DeliveryMethod.Express })
  deliveryMethod?: DeliveryMethod;

  @ApiProperty({ example: 2599.98 })
  totalPrice: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'سفارش شما در حال پردازش است' })
  statusHistory: string;
}

export class CancelOrderResponseDto {
  @ApiProperty({ example: 'Order cancelled successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Cancelled })
  status: OrderStatus;
}

// ==================== DASHBOARD RESPONSES ====================

export class UserDashboardStatsDto {
  @ApiProperty({ example: 10 })
  totalOrders: number;

  @ApiProperty({ example: 2 })
  pendingOrders: number;

  @ApiProperty({ example: 7 })
  completedOrders: number;

  @ApiProperty({ example: 1 })
  cancelledOrders: number;

  @ApiProperty({ example: 12999.99 })
  totalSpent: number;
}

export class DashboardUserInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/users/thumbnails/123.jpg' })
  thumbnail?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UserDashboardResponseDto {
  @ApiProperty({ type: DashboardUserInfoDto })
  user: DashboardUserInfoDto;

  @ApiProperty({ type: UserDashboardStatsDto })
  stats: UserDashboardStatsDto;

  @ApiProperty({ type: [OrderResponseDto] })
  recentOrders: OrderResponseDto[];
}

