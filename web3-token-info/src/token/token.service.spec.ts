import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token', () => {
    const token = service.get();
    expect(token).toBeDefined();
    expect(token).toEqual({
      id: expect.any(String),
      symbol: expect.any(String),
      name: expect.any(String),
      platform: {
        ethereum: expect.any(String),
        polygon: expect.any(String),
      },
    });
  });
});
