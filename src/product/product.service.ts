import { BadRequestException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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

  filterPath(images: Express.Multer.File[] | Express.Multer.File) {
    if (Array.isArray(images)) {
      return images.map((img) => img.path);
    }
  }
}
