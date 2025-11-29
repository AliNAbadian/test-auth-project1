import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'علی',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'محمدی',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'National code (10 digits)',
    example: 1234567890,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'کدملی باید عدد باشد' })
  @Type(() => Number)
  nationalCode?: number;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: 1234567890,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'کدپستی باید عدد باشد' })
  @Type(() => Number)
  postalCode?: number;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'User thumbnail/profile image URL',
    example: 'http://localhost:8000/uploads/users/thumbnails/123.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
