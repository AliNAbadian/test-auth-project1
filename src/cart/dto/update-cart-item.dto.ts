import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Product ID to update in cart',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'New quantity',
    example: 3,
    minimum: 1,
  })
  @IsPositive()
  quantity: number;
}
