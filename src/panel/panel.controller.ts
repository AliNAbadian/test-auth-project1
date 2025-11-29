import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PanelService } from './panel.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ChangePhoneDto } from 'src/user/dto/change-phone.dto';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  ProfileResponseDto,
  ChangePhoneResponseDto,
  DeactivateAccountResponseDto,
  OrderResponseDto,
  OrderStatusResponseDto,
  CancelOrderResponseDto,
  UserDashboardResponseDto,
} from './dto/response/panel-response.dto';

@ApiTags('User Panel')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('panel')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  // ==================== PROFILE ====================

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns complete user profile including gallery images',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile with gallery',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  getProfile(@Request() req) {
    return this.panelService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Update user profile information (name, address, postal code, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.panelService.updateProfile(req.user.id, updateUserDto);
  }

  @Patch('change-phone')
  @ApiOperation({
    summary: 'Change phone number',
    description:
      'Update user phone number. In production, OTP verification should be required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Phone number updated successfully',
    type: ChangePhoneResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Phone number already in use',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  changePhone(@Body() changePhoneDto: ChangePhoneDto, @Request() req) {
    return this.panelService.changePhone(req.user.id, changePhoneDto);
  }

  @Delete('account')
  @ApiOperation({
    summary: 'Deactivate user account',
    description:
      'Deactivates the user account. Account can be reactivated by admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated successfully',
    type: DeactivateAccountResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  deactivateAccount(@Request() req) {
    return this.panelService.deactivateAccount(req.user.id);
  }

  // ==================== ORDERS ====================

  @Get('orders')
  @ApiOperation({
    summary: 'Get all user orders',
    description:
      'Returns list of all orders placed by the current user, ordered by date (newest first)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of user orders',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  getOrders(@Request() req) {
    return this.panelService.getUserOrders(req.user.id);
  }

  @Get('orders/:orderId')
  @ApiOperation({
    summary: 'Get order details by ID',
    description:
      'Returns complete order details including items and product information',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns order details with items',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  getOrderById(@Param('orderId') orderId: string, @Request() req) {
    return this.panelService.getOrderById(req.user.id, orderId);
  }

  @Get('orders/:orderId/status')
  @ApiOperation({
    summary: 'Get order status and tracking info',
    description: 'Returns current order status with Persian status description',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns order status',
    type: OrderStatusResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  getOrderStatus(@Param('orderId') orderId: string, @Request() req) {
    return this.panelService.getOrderStatus(req.user.id, orderId);
  }

  @Post('orders/:orderId/cancel')
  @ApiOperation({
    summary: 'Cancel an order',
    description:
      'Cancel an order. Only orders with "pending" status can be cancelled.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
    type: CancelOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order cannot be cancelled',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ErrorResponseDto,
  })
  cancelOrder(@Param('orderId') orderId: string, @Request() req) {
    return this.panelService.cancelOrder(req.user.id, orderId);
  }

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get user dashboard summary',
    description: 'Returns user info, order statistics, and recent orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns dashboard summary',
    type: UserDashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  getDashboard(@Request() req) {
    return this.panelService.getUserDashboard(req.user.id);
  }
}
