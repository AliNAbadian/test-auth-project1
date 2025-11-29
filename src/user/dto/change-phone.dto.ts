import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class ChangePhoneDto {
  @ApiProperty({
    description: 'New Iranian phone number',
    example: '09123456789',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  newPhoneNumber: string;
}

