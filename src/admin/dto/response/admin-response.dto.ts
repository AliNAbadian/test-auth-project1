import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/auth/enum/role.enum';
import { OrderStatus, PaymentStatus, DeliveryMethod } from 'src/order/types';

// ==================== DASHBOARD RESPONSES ====================

export class AdminDashboardStatsDto {
  @ApiProperty({ example: 1000 })
  totalUsers: number;

  @ApiProperty({ example: 950 })
  activeUsers: number;

  @ApiProperty({ example: 50 })
  inactiveUsers: number;

  @ApiProperty({ example: 500 })
  totalOrders: number;

  @ApiProperty({ example: 50 })
  pendingOrders: number;

  @ApiProperty({ example: 100 })
  processingOrders: number;

  @ApiProperty({ example: 50 })
  shippedOrders: number;

  @ApiProperty({ example: 280 })
  completedOrders: number;

  @ApiProperty({ example: 20 })
  cancelledOrders: number;

  @ApiProperty({ example: 200 })
  totalProducts: number;

  @ApiProperty({ example: 500000.00 })
  totalRevenue: number;
}

export class RecentUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;
}

export class AdminDashboardResponseDto {
  @ApiProperty({ type: AdminDashboardStatsDto })
  stats: AdminDashboardStatsDto;

  @ApiProperty({ type: [Object], description: 'Recent orders' })
  recentOrders: any[];

  @ApiProperty({ type: [RecentUserDto] })
  recentUsers: RecentUserDto[];
}

// ==================== USER MANAGEMENT RESPONSES ====================

export class AdminUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [AdminUserDto] })
  data: AdminUserDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class UpdateRoleResponseDto {
  @ApiProperty({ example: 'User roles updated successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ enum: Role, isArray: true, example: ['user', 'admin'] })
  roles: Role[];
}

export class ActivateUserResponseDto {
  @ApiProperty({ example: 'User activated successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class DeactivateUserResponseDto {
  @ApiProperty({ example: 'User deactivated successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: false })
  isActive: boolean;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'User deleted successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;
}

// ==================== ORDER MANAGEMENT RESPONSES ====================

export class AdminOrderItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: Object })
  product: any;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1299.99 })
  price: number;
}

export class AdminOrderDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ type: Object })
  user: any;

  @ApiProperty({ type: [AdminOrderItemDto] })
  items: AdminOrderItemDto[];

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

export class PaginatedOrdersResponseDto {
  @ApiProperty({ type: [AdminOrderDto] })
  data: AdminOrderDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class UpdateOrderStatusResponseDto {
  @ApiProperty({ example: 'Order status updated successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Processing })
  orderStatus: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.Completed })
  paymentStatus: PaymentStatus;
}

export class DeleteOrderResponseDto {
  @ApiProperty({ example: 'Order deleted successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;
}

// ==================== PRODUCT MANAGEMENT RESPONSES ====================

export class AdminProductDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  title: string;

  @ApiProperty({ example: 'iphone-15-pro-max' })
  slug: string;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiPropertyOptional({ example: 'Titanium Black' })
  color?: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg' })
  thumbnail?: string;

  @ApiProperty({ type: [Object] })
  gallery: any[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [AdminProductDto] })
  data: AdminProductDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class DeleteProductResponseDto {
  @ApiProperty({ example: 'Product deleted successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  productId: string;
}

