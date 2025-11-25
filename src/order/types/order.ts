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

export interface OrderItems {
  productId: number;
  quantity: number;
}
