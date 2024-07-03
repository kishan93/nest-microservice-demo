import { Module } from '@nestjs/common';
import { TokenAccessLogService } from './token-access-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenAccessLog } from './entities/token-access-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenAccessLog])],
  providers: [TokenAccessLogService],
})
export class TokenAccessLogModule {}
