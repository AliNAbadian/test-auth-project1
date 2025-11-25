import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PaymentService } from '@/payment/payment.service';
import { ProductService } from '@/product/product.service';
import { OrderItem } from './entities/order-item.entity';
import { PaymentStatus } from './types';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
  ) {}
  async test() {
    console.log(
      await this.paymentService.createPayment(
        1000,
        'test',
        'https://www.google.com',
      ),
    );
    // const user = await this.userService.findByPhonenumber('09018283172');
    // if (!user) throw new NotFoundException('User not found');
    // const newOrder = this.orderRepo.create({ userId: user.id });
    // await this.orderRepo.save(newOrder);
    // const orders = await this.userService.findOne(user.id);
    // return orders;
  }

  findUserOrders(id: number) {
    return this.orderRepo.find({ where: { userId: id } });
  }
  async create(createOrderDto: CreateOrderDto, userId: string) {
    let totalPrice = 0;
    let items: any[] = [];
    for (const item of createOrderDto.items) {
      let linePrice = 0;
      const product = await this.productService.findOne(item.productId);
      if (!product) throw new NotFoundException('Product not found');
      if (item.quantity > product.quantity) {
        // TODO: remove order
        throw new BadRequestException('Product quantity not enough');
      }
      linePrice = product.price * item.quantity;
      items.push({ product, quantity: item.quantity, price: product.price });
      totalPrice += item.quantity * product.price;
    }

    const order = this.orderRepo.create({
      userId: +userId,
      items,
      totalPrice,
    });

    console.log(order);
    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
