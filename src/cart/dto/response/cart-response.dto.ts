import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== CART ITEM DTOs ====================

export class CartProductInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  title: string;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/products/thumbnails/123.jpg' })
  thumbnail?: string;
}

export class CartItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: CartProductInfoDto })
  product: CartProductInfoDto;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1299.99, description: 'Price at time of adding to cart' })
  price: number;
}

// ==================== CART RESPONSES ====================

export class CartUserInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;
}

export class CartResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: CartUserInfoDto })
  user: CartUserInfoDto;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ example: 2599.98 })
  totalPrice: number;
}

export class CreateCartResponseDto {
  @ApiProperty({ example: 'Cart created successfully' })
  message: string;

  @ApiProperty({ type: CartResponseDto })
  cart: CartResponseDto;
}

export class AddToCartResponseDto {
  @ApiProperty({ example: 'Item added to cart successfully' })
  message: string;

  @ApiProperty({ type: CartItemResponseDto })
  item: CartItemResponseDto;

  @ApiProperty({ example: 2599.98 })
  cartTotal: number;
}

export class UpdateCartItemResponseDto {
  @ApiProperty({ example: 'Cart item updated successfully' })
  message: string;

  @ApiProperty({ type: CartItemResponseDto })
  item: CartItemResponseDto;

  @ApiProperty({ example: 2599.98 })
  cartTotal: number;
}

export class RemoveCartItemResponseDto {
  @ApiProperty({ example: 'Item removed from cart successfully' })
  message: string;

  @ApiProperty({ example: 1299.99 })
  cartTotal: number;
}

export class ClearCartResponseDto {
  @ApiProperty({ example: 'Cart cleared successfully' })
  message: string;
}

export class CartListResponseDto {
  @ApiProperty({ type: [CartResponseDto] })
  carts: CartResponseDto[];
}

