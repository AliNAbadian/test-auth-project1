import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ErrorResponseDto } from 'src/common/dto/response.dto';
import {
  CartResponseDto,
  ClearCartResponseDto,
} from './dto/response/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new cart for the user',
    description: 'Creates a new shopping cart for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  create(@Request() req) {
    return this.cartService.create(req);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all carts',
    description: 'Returns all shopping carts (admin endpoint)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all carts',
    type: [CartResponseDto],
  })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get cart by ID',
    description: 'Returns cart details by ID',
  })
  @ApiParam({ name: 'id', description: 'Cart ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Returns cart details',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found', type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update cart',
    description: 'Update cart items or recalculate totals',
  })
  @ApiParam({ name: 'id', description: 'Cart ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found', type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete/Clear cart',
    description: 'Delete cart and all its items',
  })
  @ApiParam({ name: 'id', description: 'Cart ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Cart deleted successfully',
    type: ClearCartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found', type: ErrorResponseDto })
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
