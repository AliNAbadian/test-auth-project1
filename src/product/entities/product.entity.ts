// product.entity.ts
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Gallery } from 'src/gallery/enities/gallery.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  thumbnail: string;

  // Correct OneToMany
  @OneToMany(() => Gallery, (gallery) => gallery.product, { cascade: true })
  gallery: Gallery[];

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
