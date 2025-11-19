import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { BlogModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { OtpModule } from './otp/otp.module';
import { Product } from './product/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Gallery } from './gallery/enities/gallery.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CartModule } from './cart/cart.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    BlogModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // default user
      password: 'fg465835', // matches POSTGRES_PASSWORD
      database: 'morphiq_db', // default DB
      entities: [User, Product, Gallery, Cart, CartItem],
      synchronize: true,
    }),
    OtpModule,
    MulterModule.register({
      dest: './uploads',
    }),
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
