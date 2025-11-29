import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @ApiProperty({
    description: 'Unique blog post identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Blog post title',
    example: 'Getting Started with NestJS',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Blog post slug (URL-friendly title)',
    example: 'getting-started-with-nestjs',
  })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({
    description: 'Blog post content',
    example: 'NestJS is a progressive Node.js framework...',
  })
  @Column('text')
  content: string;

  @ApiPropertyOptional({
    description: 'Blog post thumbnail image URL',
    example: 'http://localhost:8000/uploads/blogs/123.jpg',
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'Blog post excerpt/summary',
    example: 'Learn the basics of NestJS framework',
  })
  @Column({ nullable: true })
  excerpt: string;

  @ApiProperty({
    description: 'Whether the blog post is published',
    example: true,
  })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({
    description: 'Blog post creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Blog post last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
