import { Module } from '@nestjs/common';
import { UserKeyService } from './user-key.service';
import { UserKeyController } from './user-key.controller';
import { UserKey } from './entities/user-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserKey])],
  controllers: [UserKeyController],
  providers: [UserKeyService],
})
export class UserKeyModule {}
