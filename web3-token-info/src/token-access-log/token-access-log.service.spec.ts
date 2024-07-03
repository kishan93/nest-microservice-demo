import { Test, TestingModule } from '@nestjs/testing';
import { TokenAccessLogService } from './token-access-log.service';

describe('TokenAccessLogService', () => {
  let service: TokenAccessLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenAccessLogService],
    }).compile();

    service = module.get<TokenAccessLogService>(TokenAccessLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
