import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  // async signIn(username: string, pass: string) {
  //   const user = await this.userService.findOne(username);

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   if (user.password !== pass) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   const payload = { sub: user.userId, username: user.username };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  async signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      password: user.password,
      roles: user.roles,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (user && user.password == pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
