import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiPropertyOptional({
    description: 'User ID (optional, usually taken from JWT)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId?: string;
}
