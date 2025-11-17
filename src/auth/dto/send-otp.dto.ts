import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  phoneNumber: string;
}
