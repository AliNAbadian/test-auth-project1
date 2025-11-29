import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPhoneNumber, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Iranian phone number',
    example: '09123456789',
  })
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: 123456,
    minimum: 100000,
    maximum: 999999,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(100000)
  @Max(999999)
  otp: number;
}
