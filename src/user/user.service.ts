import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto); // create entity

    return await this.userRepository.save(user); // save to DB
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id: +id } });
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
}
