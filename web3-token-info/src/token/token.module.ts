import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { CheckAccessKeyMiddleware } from 'src/common/middleware/check-access-key.middleware';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
