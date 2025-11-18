import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPhoneNumber, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(100000)
  @Max(999999)
  otp: number;
}
