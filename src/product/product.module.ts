import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { GalleryModule } from 'src/gallery/gallery.module';
import { ProductSeedService } from './product-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), GalleryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductSeedService],
  exports: [ProductService, ProductSeedService],
})
export class ProductModule {}
