import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { OrderModule } from '@/order/order.module';
import { ProductModule } from '@/product/product.module';

@Module({
  imports: [OrderModule, ProductModule],
  providers: [TasksService],
})
export class TasksModule {}
