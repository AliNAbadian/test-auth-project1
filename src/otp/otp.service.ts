import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async generateOtp(phone: string): Promise<{ otp: string; message: string }> {
    const isOtpAlreadyExsit = await this.redis.get(`otp:${phone}`);

    if (Boolean(isOtpAlreadyExsit)) {
      const timeLeft = await this.redis.ttl(`otp:${phone}`);
      // throw new BadRequestException(
      //   `You Must Wait Before Requesting new otp: ${timeLeft} seconds left`,
      // );
    }
    const otp = Math.floor(100000 + Math.random() * 9000).toString();

    await this.redis.set(`otp:${phone}`, otp, 'EX', 120);

    return { otp: otp, message: 'OTP Sent Successfully' };
  }

  async verifyOtp(phone: string, otp: number): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${phone}`);

    return storedOtp === String(otp);
  }
}
