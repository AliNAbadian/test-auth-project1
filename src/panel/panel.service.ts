import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ChangePhoneDto } from 'src/user/dto/change-phone.dto';
import { OrderStatus } from 'src/order/types';

@Injectable()
export class PanelService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  // ==================== PROFILE ====================

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['gallery'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive fields
    const { ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = this.userRepo.merge(user, updateUserDto);
    return this.userRepo.save(updatedUser);
  }

  async changePhone(userId: string, changePhoneDto: ChangePhoneDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if phone number is already in use
    const existingUser = await this.userRepo.findOne({
      where: { phoneNumber: changePhoneDto.newPhoneNumber },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Phone number already in use');
    }

    // In real app, you'd send OTP to new number first
    // For now, we'll just update it
    user.phoneNumber = changePhoneDto.newPhoneNumber;
    await this.userRepo.save(user);

    return {
      message: 'Phone number updated successfully',
      phoneNumber: user.phoneNumber,
    };
  }

  async deactivateAccount(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.userRepo.save(user);

    return { message: 'Account deactivated successfully' };
  }

  // ==================== ORDERS ====================

  async getUserOrders(userId: string) {
    const orders = await this.orderRepo.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });

    return orders;
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrderStatus(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
      totalPrice: order.totalPrice,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      statusHistory: this.getStatusDescription(order.orderStatus),
    };
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow cancellation of pending orders
    if (order.orderStatus !== OrderStatus.Pending) {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.orderStatus}`,
      );
    }

    order.orderStatus = OrderStatus.Cancelled;
    await this.orderRepo.save(order);

    return {
      message: 'Order cancelled successfully',
      orderId: order.id,
      status: order.orderStatus,
    };
  }

  // ==================== DASHBOARD ====================

  async getUserDashboard(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['gallery'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orders = await this.orderRepo.find({
      where: { userId },
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === OrderStatus.Pending,
    ).length;
    const completedOrders = orders.filter(
      (o) => o.orderStatus === OrderStatus.Delivered,
    ).length;
    const totalSpent = orders
      .filter((o) => o.orderStatus === OrderStatus.Delivered)
      .reduce((sum, o) => sum + Number(o.totalPrice), 0);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        thumbnail: user.thumbnail,
        isActive: user.isActive,
      },
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders: orders.filter(
          (o) => o.orderStatus === OrderStatus.Cancelled,
        ).length,
        totalSpent,
      },
      recentOrders: orders.slice(0, 5),
    };
  }

  private getStatusDescription(status: OrderStatus): string {
    const descriptions = {
      [OrderStatus.Pending]: 'سفارش شما در انتظار پرداخت است',
      [OrderStatus.Processing]: 'سفارش شما در حال پردازش است',
      [OrderStatus.Shipped]: 'سفارش شما ارسال شده است',
      [OrderStatus.Delivered]: 'سفارش شما تحویل داده شده است',
      [OrderStatus.Cancelled]: 'سفارش شما لغو شده است',
    };
    return descriptions[status] || 'وضعیت نامشخص';
  }
}

