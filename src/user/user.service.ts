import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto); // create entity

    return await this.userRepository.save(user); // save to DB
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['gallery'] });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['gallery'],
    });
  }

  async findByPhonenumber(phoneNumber: string) {
    return this.userRepository.findOne({ where: { phoneNumber: phoneNumber } });
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getOrders(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return await this.orderService.findUserOrders(user.id);
  }
}
