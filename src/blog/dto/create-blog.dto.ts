import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog post title',
    example: 'Getting Started with NestJS',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Blog post content',
    example: 'NestJS is a progressive Node.js framework...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Blog post thumbnail image URL',
    example: 'http://localhost:8000/uploads/blogs/123.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Blog post excerpt/summary',
    example: 'Learn the basics of NestJS framework',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;
}
