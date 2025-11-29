import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== COMMON RESPONSE DTOs ====================

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation successful' })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiPropertyOptional({ example: 'Validation failed' })
  error?: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

