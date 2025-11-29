import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/auth/enum/role.enum';

// ==================== OTP RESPONSES ====================

export class SendOtpResponseDto {
  @ApiProperty({ example: 'OTP sent successfully' })
  message: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiProperty({ example: 120, description: 'OTP expiry time in seconds' })
  expiresIn: number;
}

export class UserInfoDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];
}

export class VerifyOtpResponseDto {
  @ApiProperty({ example: 'Logged In' })
  message: string;

  @ApiProperty({ type: UserInfoDto })
  userInfo: UserInfoDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;
}

// ==================== LOGIN RESPONSES ====================

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;

  @ApiProperty({ example: 'Please remove the token from client storage' })
  note: string;
}

// ==================== PROFILE RESPONSES ====================

export class UserProfileResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 1234567890 })
  nationalCode?: number;

  @ApiPropertyOptional({ example: 1234567890 })
  postalCode?: number;

  @ApiPropertyOptional({ example: 'تهران، خیابان ولیعصر' })
  address?: string;

  @ApiPropertyOptional({ example: 'http://localhost:8000/uploads/users/thumbnails/123.jpg' })
  thumbnail?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class CurrentUserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'علی' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'محمدی' })
  lastName?: string;

  @ApiProperty({ enum: Role, isArray: true, example: ['user'] })
  roles: Role[];

  @ApiProperty({ example: true })
  isActive: boolean;
}

