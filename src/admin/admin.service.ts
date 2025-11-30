import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Role } from 'src/auth/enum/role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, PaymentStatus } from 'src/order/types';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  // ==================== DASHBOARD ====================

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const activeUsers = await this.userRepo.count({ where: { isActive: true } });
    const totalOrders = await this.orderRepo.count();
    const pendingOrders = await this.orderRepo.count({
      where: { orderStatus: OrderStatus.Pending },
    });
    const completedOrders = await this.orderRepo.count({
      where: { orderStatus: OrderStatus.Delivered },
    });
    const totalProducts = await this.productRepo.count();

    // Calculate total revenue
    const completedOrdersList = await this.orderRepo.find({
      where: { orderStatus: OrderStatus.Delivered },
    });
    const totalRevenue = completedOrdersList.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0,
    );

    // Recent orders
    const recentOrders = await this.orderRepo.find({
      order: { created_at: 'DESC' },
      take: 10,
      relations: ['user'],
    });

    // Recent users
    const recentUsers = await this.userRepo.find({
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalOrders,
        pendingOrders,
        processingOrders: await this.orderRepo.count({
          where: { orderStatus: OrderStatus.Processing },
        }),
        shippedOrders: await this.orderRepo.count({
          where: { orderStatus: OrderStatus.Shipped },
        }),
        completedOrders,
        cancelledOrders: await this.orderRepo.count({
          where: { orderStatus: OrderStatus.Cancelled },
        }),
        totalProducts,
        totalRevenue,
      },
      recentOrders,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        isActive: u.isActive,
        roles: u.roles,
        created_at: u.created_at,
      })),
    };
  }

  // ==================== USER MANAGEMENT ====================

  async getUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.phoneNumber LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        isActive: u.isActive,
        roles: u.roles,
        created_at: u.created_at,
        updated_at: u.updated_at,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['gallery', 'orders'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(userId: string, roles: Role[]) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = roles;
    await this.userRepo.save(user);

    return {
      message: 'User roles updated successfully',
      userId: user.id,
      roles: user.roles,
    };
  }

  async activateUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    await this.userRepo.save(user);

    return {
      message: 'User activated successfully',
      userId: user.id,
      isActive: user.isActive,
    };
  }

  async deactivateUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.userRepo.save(user);

    return {
      message: 'User deactivated successfully',
      userId: user.id,
      isActive: user.isActive,
    };
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.delete(userId);

    return {
      message: 'User deleted successfully',
      userId,
    };
  }

  // ==================== ORDER MANAGEMENT ====================

  async getOrders(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      queryBuilder.where('order.orderStatus = :status', { status });
    }

    const [orders, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('order.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (updateStatusDto.orderStatus) {
      order.orderStatus = updateStatusDto.orderStatus;
    }

    if (updateStatusDto.paymentStatus) {
      order.paymentStatus = updateStatusDto.paymentStatus;
    }

    await this.orderRepo.save(order);

    return {
      message: 'Order status updated successfully',
      orderId: order.id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    };
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepo.delete(orderId);

    return {
      message: 'Order deleted successfully',
      orderId,
    };
  }

  async updateTrackingCode(orderId: string, trackingCode: string) {
    return this.orderService.updateTrackingCode(orderId, trackingCode);
  }

  // ==================== PRODUCT MANAGEMENT ====================

  async getProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [products, total] = await this.productRepo.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['gallery'],
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepo.delete(productId);

    return {
      message: 'Product deleted successfully',
      productId,
    };
  }
}

