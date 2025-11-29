import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Array of roles to assign',
    enum: Role,
    isArray: true,
    example: ['user', 'admin'],
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

