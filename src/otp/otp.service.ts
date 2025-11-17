import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async generateOtp(phone: string): Promise<string> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // ذخیره در Redis با TTL = 120 ثانیه
    await this.redis.set(`otp:${phone}`, otp, 'EX', 120);

    return otp;
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${phone}`);
    return storedOtp === otp;
  }
}
