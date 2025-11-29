import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty({
    description: 'Product ID to remove from cart',
    example: 1,
  })
  @IsNumber()
  productId: number;
}
