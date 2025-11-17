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
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  //   @Min(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IR')
  phoneNumber: string;
}
