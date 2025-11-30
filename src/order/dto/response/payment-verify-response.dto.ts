import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderResponseDto } from './order-response.dto';

export class PaymentVerifyResponseDto {
  @ApiProperty({ example: 'Payment verified successfully' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ example: 'processing' })
  orderStatus: string;

  @ApiProperty({ example: '123456789' })
  paymentRefId: string;

  @ApiProperty({ type: OrderResponseDto })
  order: OrderResponseDto;
}

export class PaymentAlreadyVerifiedResponseDto {
  @ApiProperty({ example: 'Payment already verified' })
  message: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ example: 'already_verified' })
  status: string;
}

