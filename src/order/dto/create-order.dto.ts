import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeliveryMethod, OrderItems, PaymentMethod } from '../types';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  items: OrderItems[];

  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
