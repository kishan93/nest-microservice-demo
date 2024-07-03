import { Injectable } from '@nestjs/common';
import { CreateTokenAccessLogDto } from './dto/create-token-access-log.dto';
import { TokenAccessLog } from './entities/token-access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class TokenAccessLogService {
  constructor(
    @InjectRepository(TokenAccessLog)
    private tokenAccessLogRepo: Repository<TokenAccessLog>,
  ) {}

  create(createTokenAccessLogDto: CreateTokenAccessLogDto) {
    const tokenAccessLog = this.tokenAccessLogRepo.create(
      createTokenAccessLogDto,
    );
    return this.tokenAccessLogRepo.save(tokenAccessLog);
  }

  findAll() {
    return this.tokenAccessLogRepo.find();
  }

  findByKey(key: string) {
    return this.tokenAccessLogRepo.findBy({ key });
  }

  getRateLimit(key: string) {
    return this.tokenAccessLogRepo.count({
      where: {
        key,
        success: true,
        createdAt: MoreThan(moment().startOf('day').toDate()),
      },
    });
  }

  logAccess(createTokenAccessLogDto: CreateTokenAccessLogDto) {
    const log = this.tokenAccessLogRepo.create(createTokenAccessLogDto);
    return this.tokenAccessLogRepo.save(log);
  }
}
