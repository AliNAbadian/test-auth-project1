import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
