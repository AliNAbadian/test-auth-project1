import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './enities/gallery.entity';
import { Product } from 'src/product/entities/product.entity';
import { GalleryController } from './gallery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Product])],
  providers: [GalleryService],
  exports: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
