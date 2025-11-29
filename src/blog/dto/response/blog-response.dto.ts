import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== BLOG RESPONSES ====================

export class BlogResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Getting Started with NestJS' })
  title: string;

  @ApiProperty({ example: 'getting-started-with-nestjs' })
  slug: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  content: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/blogs/123.jpg' })
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'Learn the basics of NestJS framework' })
  excerpt?: string;

  @ApiProperty({ example: true })
  isPublished: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class BlogListResponseDto {
  @ApiProperty({ type: [BlogResponseDto] })
  blogs: BlogResponseDto[];
}

export class DeleteBlogResponseDto {
  @ApiProperty({ example: 'Blog post deleted successfully' })
  message: string;
}

