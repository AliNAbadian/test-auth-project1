import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  //   CashOnDelivery = 'cashOnDelivery',
  OnlinePayment = 'onlinePayment',
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

export enum DeliveryMethod {
  Express = 'express',
  Tipax = 'tipax',
}

export class OrderItems {
  @IsString()
  @Type(() => String)
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
