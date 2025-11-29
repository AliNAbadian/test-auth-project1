import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  AdminDashboardResponseDto,
  PaginatedUsersResponseDto,
  AdminUserDto,
  UpdateRoleResponseDto,
  ActivateUserResponseDto,
  DeactivateUserResponseDto,
  DeleteUserResponseDto,
  PaginatedOrdersResponseDto,
  AdminOrderDto,
  UpdateOrderStatusResponseDto,
  DeleteOrderResponseDto,
  PaginatedProductsResponseDto,
  DeleteProductResponseDto,
} from './dto/response/admin-response.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get admin dashboard statistics',
    description:
      'Returns comprehensive statistics including users, orders, products, and revenue',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns dashboard statistics',
    type: AdminDashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ==================== USER MANAGEMENT ====================

  @Get('users')
  @ApiOperation({
    summary: 'Get all users with pagination',
    description: 'Returns paginated list of users with optional search filter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by phone, first name, or last name',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of users',
    type: PaginatedUsersResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page, limit, search);
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: 'Get user details by ID',
    description: 'Returns complete user details including gallery and orders',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user details',
    type: AdminUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getUserById(@Param('userId') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Patch('users/:userId/role')
  @ApiOperation({
    summary: 'Update user roles',
    description: 'Assign new roles to a user. Replaces existing roles.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User roles updated',
    type: UpdateRoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(userId, updateRoleDto.roles);
  }

  @Patch('users/:userId/activate')
  @ApiOperation({
    summary: 'Activate user account',
    description: 'Reactivate a deactivated user account',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User activated',
    type: ActivateUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  activateUser(@Param('userId') userId: string) {
    return this.adminService.activateUser(userId);
  }

  @Patch('users/:userId/deactivate')
  @ApiOperation({
    summary: 'Deactivate user account',
    description: 'Deactivate a user account. User will not be able to login.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deactivated',
    type: DeactivateUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  deactivateUser(@Param('userId') userId: string) {
    return this.adminService.deactivateUser(userId);
  }

  @Delete('users/:userId')
  @ApiOperation({
    summary: 'Delete user account permanently',
    description:
      'Permanently delete a user and all associated data. This action cannot be undone.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: DeleteUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // ==================== ORDER MANAGEMENT ====================

  @Get('orders')
  @ApiOperation({
    summary: 'Get all orders with pagination',
    description: 'Returns paginated list of orders with optional status filter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by order status',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of orders',
    type: PaginatedOrdersResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.adminService.getOrders(page, limit, status);
  }

  @Get('orders/:orderId')
  @ApiOperation({
    summary: 'Get order details by ID',
    description:
      'Returns complete order details including user, items, and products',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns order details',
    type: AdminOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getOrderById(@Param('orderId') orderId: string) {
    return this.adminService.getOrderById(orderId);
  }

  @Patch('orders/:orderId/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update order status and/or payment status',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
    type: UpdateOrderStatusResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Delete('orders/:orderId')
  @ApiOperation({
    summary: 'Delete order permanently',
    description:
      'Permanently delete an order and all associated items. This action cannot be undone.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted',
    type: DeleteOrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  deleteOrder(@Param('orderId') orderId: string) {
    return this.adminService.deleteOrder(orderId);
  }

  // ==================== PRODUCT MANAGEMENT ====================

  @Get('products')
  @ApiOperation({
    summary: 'Get all products with pagination',
    description: 'Returns paginated list of products with gallery',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of products',
    type: PaginatedProductsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getProducts(page, limit);
  }

  @Delete('products/:productId')
  @ApiOperation({
    summary: 'Delete product permanently',
    description:
      'Permanently delete a product and all associated gallery images. This action cannot be undone.',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
    type: DeleteProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
    type: ErrorResponseDto,
  })
  deleteProduct(@Param('productId') productId: string) {
    return this.adminService.deleteProduct(productId);
  }
}
