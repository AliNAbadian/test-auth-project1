import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { UserGallery } from './user-gallery.entity';

@Entity()
export class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'علی',
  })
  @Column({ nullable: true })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'محمدی',
  })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({
    description: 'User roles',
    enum: Role,
    isArray: true,
    example: ['user'],
  })
  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  roles: Role[];

  @ApiProperty({
    description: 'Iranian phone number',
    example: '09123456789',
  })
  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'National code (10 digits)',
    example: 1234567890,
  })
  @Column({ unique: true, nullable: true })
  nationalCode: number;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: 1234567890,
  })
  @Column({ nullable: true })
  postalCode: number;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'تهران، خیابان ولیعصر',
  })
  @Column({ nullable: true })
  address: string;

  @ApiPropertyOptional({
    description: 'User thumbnail/profile image URL',
    example: 'http://localhost:8000/uploads/users/thumbnails/123.jpg',
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'User orders',
    type: () => [Order],
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ApiPropertyOptional({
    description: 'User gallery images',
    type: () => [UserGallery],
  })
  @OneToMany(() => UserGallery, (gallery) => gallery.user, { cascade: true })
  gallery: UserGallery[];

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
