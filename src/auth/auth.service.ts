import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpService } from 'src/otp/otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
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

  async requestOtp(sendOtpDto: SendOtpDto) {
    return this.otpService.generateOtp(sendOtpDto.phoneNumber);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const validOtp = await this.otpService.verifyOtp(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.otp,
    );

    if (!validOtp) throw new BadRequestException('Otp is not valid');

    const userIsAvailable = await this.userService.findByPhonenumber(
      verifyOtpDto.phoneNumber,
    );

    if (userIsAvailable) {
      const token = await this.jwtService.signAsync({
        id: userIsAvailable.id,
        phoneNumber: userIsAvailable.phoneNumber,
        firstName: userIsAvailable.firstName,
        lastName: userIsAvailable.lastName,
        roles: userIsAvailable.roles,
      });

      return {
        message: 'Logged In',
        userInfo: {
          id: userIsAvailable.id,
          phoneNumber: userIsAvailable.phoneNumber,
          firstName: userIsAvailable.firstName,
          lastName: userIsAvailable.lastName,
          roles: userIsAvailable.roles,
        },
        token,
      };
    } else {
      const newUser = await this.userService.create({
        phoneNumber: verifyOtpDto.phoneNumber,
      });

      const token = await this.jwtService.signAsync({
        id: newUser.id,
        phoneNumber: newUser.phoneNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roles: newUser.roles,
      });

      return {
        message: 'User Created Successfully',
        userInfo: {
          id: newUser.id,
          phoneNumber: newUser.phoneNumber,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          roles: newUser.roles,
        },
        token,
      };
    }
  }

  async fetchProfile(req: any) {
    const user = req.user as UserProfile;
    if (!user) throw new BadRequestException();
    const originalUser = await this.userService.findByPhonenumber(
      user.phoneNumber,
    );

    if (!originalUser)
      throw new NotFoundException('User With This PhoneNumber Not Found');

    return originalUser;
  }

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
    // if (user && user.password == pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
  }
}
