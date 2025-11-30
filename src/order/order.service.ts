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
import { PaymentStatus, OrderStatus } from './types';

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

  async checkPendingOrder(userId: string): Promise<boolean> {
    const pendingOrder = await this.orderRepo.findOne({
      where: {
        userId,
        orderStatus: OrderStatus.Pending,
        paymentStatus: PaymentStatus.Pending,
      },
    });
    return !!pendingOrder;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    // Check if user has a pending order
    const hasPendingOrder = await this.checkPendingOrder(userId);
    if (hasPendingOrder) {
      throw new BadRequestException(
        'You have a pending order. Please complete or cancel it before creating a new order.',
      );
    }
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
    
    const callbackUrl = `${process.env.APP_URL || 'http://localhost:8000'}/order/payment/verify`;
    
    const payment = await this.paymentService.createPayment(
      order.totalPrice,
      `Payment for order ${order.id}`,
      callbackUrl,
      { orderId: order.id },
    );

    order.paymentStatus = PaymentStatus.Pending;
    order.paymentAuthority = payment.authority;

    await this.orderRepo.save(order);
    return payment;
  }

  async verifyPayment(authority: string, status: string) {
    // Find order by payment authority
    const order = await this.orderRepo.findOne({
      where: { paymentAuthority: authority },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found for this payment');
    }

    // If payment was already verified
    if (order.paymentStatus === PaymentStatus.Completed) {
      return {
        message: 'Payment already verified',
        orderId: order.id,
        status: 'already_verified',
      };
    }

    // If user cancelled payment
    if (status !== 'OK') {
      order.paymentStatus = PaymentStatus.Failed;
      await this.orderRepo.save(order);
      
      // Revert product quantities
      for (const item of order.items) {
        await this.productService.revertProductQuantity(
          item.product.id,
          item.quantity,
        );
      }

      throw new BadRequestException('Payment was cancelled or failed');
    }

    // Verify payment with gateway
    const verification = await this.paymentService.verifyPayment(
      order.totalPrice,
      authority,
    );

    if (verification.status === 'SUCCESS') {
      order.paymentStatus = PaymentStatus.Completed;
      order.paymentRefId = verification.refId;
      order.orderStatus = OrderStatus.Processing;
      await this.orderRepo.save(order);

      return {
        message: 'Payment verified successfully',
        orderId: order.id,
        orderStatus: order.orderStatus,
        paymentRefId: verification.refId,
        order: await this.orderRepo.findOne({
          where: { id: order.id },
          relations: ['items', 'items.product'],
        }),
      };
    } else {
      order.paymentStatus = PaymentStatus.Failed;
      await this.orderRepo.save(order);

      // Revert product quantities
      for (const item of order.items) {
        await this.productService.revertProductQuantity(
          item.product.id,
          item.quantity,
        );
      }

      throw new BadRequestException('Payment verification failed');
    }
  }

  async updateTrackingCode(orderId: string, trackingCode: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    // Only allow tracking code for shipped orders
    if (order.orderStatus !== OrderStatus.Shipped) {
      throw new BadRequestException(
        'Tracking code can only be added to shipped orders',
      );
    }

    order.trackingCode = trackingCode;
    await this.orderRepo.save(order);

    return {
      message: 'Tracking code updated successfully',
      orderId: order.id,
      trackingCode: order.trackingCode,
    };
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

  remove(id: string) {
    console.log(`This action removes a #${id} order`);
    return this.orderRepo.delete(id);
  }
}
