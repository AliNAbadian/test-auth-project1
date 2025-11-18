import { Module, Global } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          url: 'https://immense-griffon-32128.upstash.io',
          token:
            'AX2AAAIncDI4OWI4YTFmN2UwMmI0ZmJhYjg2YWZkMjRiYTA4ZjBmOXAyMzIxMjg',
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
