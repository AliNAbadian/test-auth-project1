import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './enities/gallery.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Product])],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
