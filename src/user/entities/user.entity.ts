import { Role } from 'src/auth/enum/role.enum';
import { Order } from 'src/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true, // ← مهم! آرایه از enum
    default: [Role.User], // نقش پیش‌فرض
  })
  roles: Role[];

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  nationalCode: number;

  @Column({ nullable: true })
  postalCode: number;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date; // ← خودکار توسط DB پر می‌شود

  @UpdateDateColumn()
  updated_at: Date;
}
