import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { DeliveryMethod, OrderItems, PaymentMethod } from '../types';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order items',
    type: [OrderItems],
    example: [
      { productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  items: OrderItems[];

  @ApiProperty({
    description: 'Delivery method',
    enum: DeliveryMethod,
    example: DeliveryMethod.Express,
  })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.OnlinePayment,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
