import { OrderService } from '@/order/order.service';
import { ProductService } from '@/product/product.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}
  @Cron(CronExpression.EVERY_10_MINUTES)
  async findAndDeleteUnPaidOrders() {
    const orders = await this.orderService.findUnPaidOrders();
    for (const order of orders) {
      if (order.items.length === 0) {
        await this.orderService.remove(order.id);
        this.logger.log(`Deleted order with id: ${order.id} due to no items`);
        continue;
      } else {
        for (const item of order.items) {
          await this.productService.revertProductQuantity(
            item.product.id,
            item.quantity,
          );

          this.logger.log(
            `Reverted product id: ${item.product.id} quantity by ${item.quantity} for order id: ${order.id}`,
          );
          await this.orderService.removeOrderItems(order.id);
          await this.orderService.remove(order.id);
          this.logger.log(`Deleted unpaid order with id: ${order.id}`);
        }
      }
    }
  }
}
