import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  productId: number;

  @IsPositive()
  quantity: number;
}
