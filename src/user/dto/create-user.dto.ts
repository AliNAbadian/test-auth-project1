import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  phoneNumber: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsNumber()
  nationalCode?: number;
}
