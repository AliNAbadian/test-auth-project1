import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SignInDto } from './dto/sign-in.dto';
import {
  SendOtpResponseDto,
  VerifyOtpResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  UserProfileResponseDto,
  CurrentUserResponseDto,
} from './dto/response/auth-response.dto';
import { ErrorResponseDto } from 'src/common/dto/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({
    summary: 'Send OTP to phone number',
    description:
      'Sends a 6-digit OTP code to the specified Iranian phone number. OTP expires in 2 minutes.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    type: SendOtpResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid phone number',
    type: ErrorResponseDto,
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.requestOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP and login/register',
    description:
      'Verifies the OTP code. If user exists, logs them in. Otherwise creates a new account.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, returns JWT token',
    type: VerifyOtpResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP',
    type: ErrorResponseDto,
  })
  async verifyOtp(@Body() verifyOtp: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtp);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login with username and password',
    description: 'Authenticate user with username/password credentials',
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logout the current user. Token should be removed from client storage.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    type: ErrorResponseDto,
  })
  logout(@Request() req): LogoutResponseDto {
    return {
      message: 'Logged out successfully',
      note: 'Please remove the token from client storage',
    };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with username and password',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: SignUpDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists or invalid data',
    type: ErrorResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns complete profile information for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  getProfile(@Request() req) {
    return this.authService.fetchProfile(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user from JWT token',
    description: 'Returns basic user information extracted from the JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns current user info',
    type: CurrentUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  getMe(@Request() req) {
    return {
      id: req.user.id,
      phoneNumber: req.user.phoneNumber,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      roles: req.user.roles,
      isActive: req.user.isActive,
    };
  }
}
