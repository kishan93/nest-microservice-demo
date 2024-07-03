import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import { CreateTokenAccessLogDto } from 'src/token-access-log/dto/create-token-access-log.dto';
import { TokenAccessLogService } from 'src/token-access-log/token-access-log.service';
import { UserKeyService } from 'src/user-key/user-key.service';

@Injectable()
export class CheckAccessKeyMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserKeyService)
    private userKeyService: UserKeyService,
    @Inject(TokenAccessLogService)
    private tokenAccessLogService: TokenAccessLogService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['x-app-key'] as string;

    if (!key) {
      throw new HttpException(
        'Access key is required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessKey = await this.userKeyService.find(key);
    if (!accessKey) {
      throw new HttpException('Invalid access key', HttpStatus.FORBIDDEN);
    }

    if (moment().isAfter(accessKey.expiration)) {
      throw new HttpException('Access key expired', HttpStatus.FORBIDDEN);
    }

    const requestCount = await this.tokenAccessLogService.getRateLimit(key);

    const logDto = new CreateTokenAccessLogDto();
    logDto.key = key;
    logDto.ip = req.ip;
    logDto.success = requestCount < accessKey.rateLimit;
    this.tokenAccessLogService.logAccess(logDto);

    res.header('X-Rate-Limit-Limit', accessKey.rateLimit.toString());
    res.header('X-Rate-Limit-Reset', moment().endOf('day').unix().toString());

    if (!logDto.success) {
      res.header(
        'X-rate-Limit-Remaining',
        (accessKey.rateLimit - requestCount).toString(),
      );
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    res.header(
      'X-Rate-Limit-Remaining',
      (accessKey.rateLimit - requestCount - 1).toString(),
    );

    next();
  }
}
