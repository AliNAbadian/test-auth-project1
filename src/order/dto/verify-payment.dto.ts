import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Payment authority code from payment gateway',
    example: 'A000000000000000000000000000000000000',
  })
  @IsNotEmpty()
  @IsString()
  Authority: string;

  @ApiProperty({
    description: 'Payment status code',
    example: 'OK',
  })
  @IsNotEmpty()
  @IsString()
  Status: string;
}

