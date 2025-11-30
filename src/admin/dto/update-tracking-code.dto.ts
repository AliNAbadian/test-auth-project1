import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTrackingCodeDto {
  @ApiProperty({
    description: 'Transportation tracking code',
    example: 'IR123456789',
  })
  @IsNotEmpty()
  @IsString()
  trackingCode: string;
}

