import { DeliveryMethod, OrderItems } from '../types';

export class CreateOrderDto {
    @
  items: OrderItems[];

  deliveryMethod: DeliveryMethod;
  paymentMethod: string;
}
