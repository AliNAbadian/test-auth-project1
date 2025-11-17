import { Role } from 'src/auth/enum/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date; // ← خودکار توسط DB پر می‌شود
}
