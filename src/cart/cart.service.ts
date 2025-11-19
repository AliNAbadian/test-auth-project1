import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly userService: UserService,
  ) {}

  async create(req) {
    const user = await this.userService.findByPhonenumber(req.phoneNumber);
    if (!user) throw new NotFoundException('User not found');

    // چک کن آیا Cart قبلاً ساخته شده
    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });

    console.log(cart);
    // اگر نبود بساز
    if (!cart) {
      cart = await this.createCartForUser(user);
    }

    return cart; // ← خروجی واقعی
  }

  async createCartForUser(user: any) {
    // چک مجدد (نوع را تضمین می‌کند)
    if (!user) throw new NotFoundException('User not found');

    const existingCart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (existingCart) return existingCart;

    const newCart = this.cartRepo.create({
      user: user,
      items: [],
      totalPrice: 0,
    });

    return await this.cartRepo.save(newCart);
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: number) {
    return `This action returns cart #${id}`;
  }

  update(id: number) {
    return `This action updates cart #${id}`;
  }

  remove(id: number) {
    return `This action removes cart #${id}`;
  }
}
