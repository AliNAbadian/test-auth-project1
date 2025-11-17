import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/role.decorator';
import { Role } from './enum/role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: Request) {
    return { message: 'Logged Out' };
  }

  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(Role.Admin)
  getProfile(@Request() req) {
    return req.user;
  }
}
