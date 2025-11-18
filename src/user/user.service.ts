import { Injectable } from '@nestjs/common';
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

  async findOne(id: string) {
    return this.userRepository.find({ where: { id: +id } });
  }

  async findByPhonenumber(phoneNumber: string) {
    return this.userRepository.findOne({ where: { phoneNumber: phoneNumber } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
