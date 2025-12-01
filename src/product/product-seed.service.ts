import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Generate a URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate random product data
   */
  private generateProductData(index: number): Partial<Product> {
    const categories = [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Sports & Outdoors',
      'Books',
      'Toys & Games',
      'Beauty & Personal Care',
      'Automotive',
      'Health & Wellness',
      'Kitchen & Dining',
    ];

    const colors = [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Silver',
      'Gold',
      'Gray',
      'Brown',
      'Pink',
      'Purple',
      'Orange',
      'Navy',
      'Beige',
    ];

    const category = categories[index % categories.length];
    const productNumber = index + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Generate varied product titles
    const productTitles = [
      `${category} Item ${productNumber}`,
      `Premium ${category} ${productNumber}`,
      `Professional ${category} ${productNumber}`,
      `Deluxe ${category} ${productNumber}`,
      `${category} Pro ${productNumber}`,
      `Classic ${category} ${productNumber}`,
      `Modern ${category} ${productNumber}`,
      `Advanced ${category} ${productNumber}`,
    ];

    const title = productTitles[index % productTitles.length];
    const slug = `${this.generateSlug(title)}-${productNumber}`;

    // Generate realistic prices (between $10 and $2000)
    const basePrice = Math.floor(Math.random() * 1990) + 10;
    const price = parseFloat((basePrice + Math.random()).toFixed(2));

    // Generate realistic quantities (between 0 and 500)
    const quantity = Math.floor(Math.random() * 501);

    // Generate dimensions (optional, 70% chance)
    const dimensions = Math.random() > 0.3
      ? `${(Math.random() * 50 + 10).toFixed(1)} x ${(Math.random() * 50 + 10).toFixed(1)} x ${(Math.random() * 20 + 5).toFixed(1)} cm`
      : null;

    // Generate thumbnail URL (optional, 60% chance)
    const thumbnail = Math.random() > 0.4
      ? `http://localhost:8000/uploads/products/thumbnails/product-${productNumber}.jpg`
      : null;

    return {
      title,
      slug,
      color,
      dimensions,
      thumbnail,
      price,
      quantity,
    };
  }

  /**
   * Seed database with 200 products
   */
  async seedProducts(count: number = 200): Promise<{ message: string; created: number }> {
    // Get all existing slugs to avoid duplicates
    const existingProducts = await this.productRepository.find({
      select: ['slug'],
    });
    const existingSlugs = new Set(existingProducts.map((p) => p.slug));

    const products: Partial<Product>[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < count; i++) {
      const productData = this.generateProductData(i);
      
      // Ensure unique slug by appending timestamp and index if slug already exists
      let finalSlug = productData.slug;
      let slugCounter = 0;
      
      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${productData.slug}-${timestamp}-${slugCounter}`;
        slugCounter++;
      }
      
      productData.slug = finalSlug;
      existingSlugs.add(finalSlug);
      products.push(productData);
    }

    // Insert products in batches for better performance
    const batchSize = 50;
    let created = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const productEntities = this.productRepository.create(batch);
      const saved = await this.productRepository.save(productEntities);
      created += saved.length;
    }

    return {
      message: `Successfully seeded ${created} products`,
      created,
    };
  }

  /**
   * Clear all products (useful for re-seeding)
   */
  async clearProducts(): Promise<{ message: string; deleted: number }> {
    const count = await this.productRepository.count();
    await this.productRepository.delete({});
    
    return {
      message: `Successfully deleted ${count} products`,
      deleted: count,
    };
  }
}

