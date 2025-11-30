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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  OrderResponseDto,
  DeleteOrderResponseDto,
} from './dto/response/order-response.dto';
import {
  PaymentVerifyResponseDto,
  PaymentAlreadyVerifiedResponseDto,
} from './dto/response/payment-verify-response.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Create a new order with items. Initiates payment process. User must not have a pending order.',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully, returns payment URL',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data, insufficient stock, or pending order exists', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Returns all orders (admin/test endpoint)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  findAll() {
    return this.orderService.test();
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Checkout and create order',
    description: 'Same as create order - processes checkout and creates order',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout successful, order created',
  })
  @ApiResponse({ status: 400, description: 'Invalid checkout data or pending order exists', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  checkout(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get('payment/verify')
  @ApiOperation({
    summary: 'Payment verification callback',
    description: 'Callback endpoint for payment gateway to verify payment. Called after user completes payment. This endpoint is public and called by the payment gateway.',
  })
  @ApiQuery({ name: 'Authority', required: true, type: String, description: 'Payment authority code from gateway' })
  @ApiQuery({ name: 'Status', required: true, type: String, description: 'Payment status (OK for success, NOK for cancelled)' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
    type: PaymentVerifyResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment already verified',
    type: PaymentAlreadyVerifiedResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Payment verification failed or cancelled', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found', type: ErrorResponseDto })
  verifyPayment(@Query('Authority') authority: string, @Query('Status') status: string) {
    return this.orderService.verifyPayment(authority, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Returns order details by ID',
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Returns order details',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update an order',
    description: 'Update order details',
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found', type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete/Cancel an order',
    description: 'Delete or cancel an order',
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted/cancelled successfully',
    type: DeleteOrderResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found', type: ErrorResponseDto })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
