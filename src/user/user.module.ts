import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderModule } from 'src/order/order.module';
import { UserGallery } from './entities/user-gallery.entity';
import { UserGalleryService } from './user-gallery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, UserGallery]),
    forwardRef(() => OrderModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserGalleryService],
  exports: [UserService, UserGalleryService],
})
export class UserModule {}
