import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserGallery } from './user/entities/user-gallery.entity';
import { OtpModule } from './otp/otp.module';
import { Product } from './product/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Gallery } from './gallery/enities/gallery.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CartModule } from './cart/cart.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './common/middlewares/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { PanelModule } from './panel/panel.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    BlogModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres', // default user
      password: process.env.DB_PASSWORD || '465835', // matches POSTGRES_PASSWORD
      database: process.env.DB_NAME || 'morphiq_db', // default DB
      entities: [
        User,
        UserGallery,
        Product,
        Gallery,
        Cart,
        CartItem,
        Order,
        OrderItem,
        Blog,
      ],
      synchronize: true,
    }),
    OtpModule,
    MulterModule.register({
      dest: './uploads',
    }),
    CartModule,
    OrderModule,
    PaymentModule,

    ScheduleModule.forRoot(),
    TasksModule,
    PanelModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
