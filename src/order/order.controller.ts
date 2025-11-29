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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  OrderResponseDto,
  DeleteOrderResponseDto,
} from './dto/response/order-response.dto';

@ApiTags('Order')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Create a new order with items. Initiates payment process.',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully, returns payment URL',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data or insufficient stock', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
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
  @ApiOperation({
    summary: 'Checkout and create order',
    description: 'Same as create order - processes checkout and creates order',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout successful, order created',
  })
  @ApiResponse({ status: 400, description: 'Invalid checkout data', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  checkout(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get(':id')
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
