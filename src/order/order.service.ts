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

  findUserOrders(id: string) {
    return this.orderRepo.find({ where: { userId: id } });
  }
  async create(createOrderDto: CreateOrderDto, userId: string) {
    let totalPrice = 0;
    console.log('first');
    let items: any[] = [];
    for (const item of createOrderDto.items) {
      let linePrice = 0;
      console.log('productId received = ', item.productId);
      const product = await this.productService.findOne(item.productId);
      if (!product) throw new NotFoundException('Product not found');
      if (item.quantity > product.quantity) {
        // TODO: remove order

        throw new BadRequestException('Product quantity not enough');
      }

      await this.productService.changeProductQuantity(
        product.id,
        item.quantity,
      );
      linePrice = product.price * item.quantity;
      items.push({ product, quantity: item.quantity, price: product.price });
      totalPrice += item.quantity * product.price;
    }

    const order = this.orderRepo.create({
      userId: userId,
      items,
      totalPrice,
      deliveryMethod: createOrderDto.deliveryMethod,
      paymentMethod: createOrderDto.paymentMethod,
    });

    await this.orderRepo.save(order);

    for (const item of items) {
      const orderItem = this.orderItemRepo.create({
        order: order,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      });
      await this.orderItemRepo.save(orderItem);
    }

    return await this.excutePayment(order.id);

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }

  async excutePayment(orderId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    const payment = await this.paymentService.createPayment(
      order.totalPrice,
      `Payment for order ${order.id}`,
      'https://www.google.com',
    );

    order.paymentStatus = PaymentStatus.Pending;

    await this.orderRepo.save(order);
    return payment;
  }

  async removeOrderItems(orderId: string) {
    await this.orderItemRepo.delete({ order: { id: orderId } });
  }

  async findAll() {
    return await this.orderRepo.find({ relations: ['items', 'items.product'] });
  }

  async findUnPaidOrders() {
    return await this.orderRepo.find({
      where: [
        { paymentStatus: PaymentStatus.Pending },
        { paymentStatus: PaymentStatus.Failed },
      ],

      relations: ['items', 'items.product'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    console.log(`This action removes a #${id} order`);
    return this.orderRepo.delete(id);
  }
}
