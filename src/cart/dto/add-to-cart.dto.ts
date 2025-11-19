import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsPositive()
  quantity: number;
}
