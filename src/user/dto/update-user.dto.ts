import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsIdentityCard,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'کدملی باید عدد باشد' })
  @Type(() => Number)
  nationalCode?: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'کدملی باید عدد باشد' })
  @Type(() => Number)
  postalCode?: number;
  @IsOptional()
  @IsString()
  address?: string;
}
