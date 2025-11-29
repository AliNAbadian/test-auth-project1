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

  findAll() {
    return this.productRepository.find({ relations: ['gallery'] });
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
