import {
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

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private readonly paymentService: PaymentService,
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
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
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
