import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenAccessLogService } from '../token-access-log/token-access-log.service';
import { CheckAccessKeyMiddleware } from '../common/middleware/check-access-key.middleware';

describe('TokenController', () => {
  let controller: TokenController;
  const tokenServiceMock = {
    get: jest.fn().mockImplementation(() => ({
      id: '1',
      symbol: 'ETH',
      name: 'Ethereum',
      platform: {
        ethereum: '0x123',
        polygon: '0x456',
      },
    })),
  };

  const checkAccessKeyMiddlewareMock = {
    use: jest.fn().mockImplementation((req, res, next) => next()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [TokenService],
    })
      .overrideProvider(CheckAccessKeyMiddleware)
      .useValue(checkAccessKeyMiddlewareMock)
      .overrideProvider(TokenService)
      .useValue(tokenServiceMock)
      .compile();

    controller = module.get<TokenController>(TokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token', () => {
    const token = controller.get();
    expect(token).toBeDefined();
    expect(tokenServiceMock.get).toHaveBeenCalled();

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
