import { User } from '@/user/entities/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from '@/user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItem } from './entities/order-item.entity';
import { PaymentModule } from '@/payment/payment.module';
import { ProductModule } from '@/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, OrderItem]),
    forwardRef(() => UserModule),
    PaymentModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
