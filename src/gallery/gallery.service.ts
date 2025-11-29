// src/gallery/gallery.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { join } from 'path';
import { Gallery } from './enities/gallery.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepo: Repository<Gallery>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async getAllGallery() {
    return this.galleryRepo.find({
      relations: ['product'],
    });
  }

  // Main method: upload multiple images for a product
  async uploadGalleryImages(
    productId: string,
    files: Array<Express.Multer.File>,
  ): Promise<Gallery[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const uploaded: Gallery[] = [];

    for (const file of files) {
      const galleryItem = this.galleryRepo.create({
        product, // relation
        url: `/uploads/products/gallery/${file.filename}`,
      });

      const saved = await this.galleryRepo.save(galleryItem);
      uploaded.push(saved);
    }

    return uploaded;
  }

  // Optional: delete image
  async remove(id: string) {
    const gallery = await this.galleryRepo.findOne({ where: { id: id } });
    if (!gallery) throw new BadRequestException('Image not found');

    // Optional: delete physical file
    // const filePath = join(__dirname, '..', '..', 'uploads', 'products', 'gallery', gallery.url.split('/').pop());
    // await unlink(filePath).catch(() => {});

    await this.galleryRepo.delete(gallery.id);
    return { message: 'Deleted' };
  }
}
