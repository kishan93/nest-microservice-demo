import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { CheckAccessKeyMiddleware } from './common/middleware/check-access-key.middleware';
import { UserKeyModule } from './user-key/user-key.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKeyService } from './user-key/user-key.service';
import { UserKey } from './user-key/entities/user-key.entity';
import { ConfigModule } from '@nestjs/config';
import { TokenAccessLogModule } from './token-access-log/token-access-log.module';
import { TokenAccessLog } from './token-access-log/entities/token-access-log.entity';
import { TokenAccessLogService } from './token-access-log/token-access-log.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT, 10) ?? 5432,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'secret',
      database: process.env.DB_NAME ?? 'test',
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([UserKey, TokenAccessLog]),

    UserKeyModule,
    TokenModule,
    TokenAccessLogModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserKeyService, TokenAccessLogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAccessKeyMiddleware).forRoutes('/token');
  }
}
