import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gallery } from 'src/gallery/enities/gallery.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  gallery?: Gallery[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;
}
