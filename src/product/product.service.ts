import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    let payload = {
      ...createProductDto,
      slug: createProductDto.title.split(' ').join('-'),
    };

    console.log(createProductDto);

    const productSameSlugExsits =
      await this.isProductSlugSame(createProductDto);

    if (productSameSlugExsits)
      throw new BadRequestException(
        `Product With Name: ${createProductDto.title} exsits`,
      );

    const newProduct = await this.productRepository.create(payload);

    return this.productRepository.save(newProduct);
  }

  async findAll(
    search?: string,
    page?: number,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    color?: string,
    inStock?: boolean,
    sortBy?: 'price' | 'title' | 'created_at',
    sortOrder?: 'ASC' | 'DESC',
  ) {
    // Set defaults
    const pageNumber = page && page > 0 ? page : 1;
    const limitNumber = limit && limit > 0 ? limit : 20;
    const skip = (pageNumber - 1) * limitNumber;
    const orderBy = sortBy || 'created_at';
    const order = sortOrder || 'DESC';

    // Build query
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.gallery', 'gallery');

    // Search filter (by title or slug)
    if (search && search.trim()) {
      queryBuilder.where(
        '(product.title ILIKE :search OR product.slug ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    // Price range filters
    if (minPrice !== undefined && minPrice !== null) {
      if (search) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
      } else {
        queryBuilder.where('product.price >= :minPrice', { minPrice });
      }
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      if (search || minPrice !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
      } else {
        queryBuilder.where('product.price <= :maxPrice', { maxPrice });
      }
    }

    // Color filter
    if (color && color.trim()) {
      const hasWhere =
        search || minPrice !== undefined || maxPrice !== undefined;
      if (hasWhere) {
        queryBuilder.andWhere('product.color ILIKE :color', {
          color: `%${color.trim()}%`,
        });
      } else {
        queryBuilder.where('product.color ILIKE :color', {
          color: `%${color.trim()}%`,
        });
      }
    }

    // In stock filter (quantity > 0)
    if (inStock === true) {
      const hasWhere =
        search ||
        minPrice !== undefined ||
        maxPrice !== undefined ||
        (color && color.trim());
      if (hasWhere) {
        queryBuilder.andWhere('product.quantity > :quantity', { quantity: 0 });
      } else {
        queryBuilder.where('product.quantity > :quantity', { quantity: 0 });
      }
    }

    // Sorting
    if (orderBy === 'price') {
      queryBuilder.orderBy('product.price', order);
    } else if (orderBy === 'title') {
      queryBuilder.orderBy('product.title', order);
    } else {
      queryBuilder.orderBy('product.created_at', order);
    }

    // Pagination
    queryBuilder.skip(skip).take(limitNumber);

    // Execute query
    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['gallery'],
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    const updatedProduct = this.productRepository.merge(
      product,
      updateProductDto,
    );

    console.log(updatedProduct);
    return this.productRepository.save(updatedProduct);
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }

  async isProductSlugSame(
    createProductDto: CreateProductDto,
  ): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { slug: createProductDto.title.split(' ').join('-') },
    });

    if (Boolean(product)) return true;
    else return false;
  }

  async getProductPrice(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product.price;
  }

  filterPath(images: Express.Multer.File[] | Express.Multer.File) {
    if (Array.isArray(images)) {
      return images.map((img) => img.path);
    }
  }

  async changeProductQuantity(id: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.quantity = product.quantity - quantity;
    return this.productRepository.save(product);
  }

  async revertProductQuantity(id: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.quantity = product.quantity + quantity;
    return this.productRepository.save(product);
  }
}
