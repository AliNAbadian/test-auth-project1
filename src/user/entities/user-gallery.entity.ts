import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_gallery')
export class UserGallery {
  @ApiProperty({
    description: 'Unique gallery image identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'http://localhost:8000/uploads/users/gallery/123.jpg',
  })
  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.gallery, {
    onDelete: 'CASCADE',
  })
  user: User;
}
