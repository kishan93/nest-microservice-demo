import { Test, TestingModule } from '@nestjs/testing';
import { CheckAccessKeyMiddleware } from './check-access-key.middleware';
import { UserKeyService } from '../../user-key/user-key.service';
import * as httpMocks from 'node-mocks-http';
import { TokenAccessLogService } from '../../token-access-log/token-access-log.service';

describe('CheckAccessKeyMiddleware', () => {
  let middleware: CheckAccessKeyMiddleware;
  let keyExpiration = new Date();
  let usedLimit = 5;
  const allowedLimit = 10;
  const key = 'test-key';

  const userKeyServiceMock = {
    find: jest.fn().mockImplementation((requestKey) => {
      if (requestKey !== key) {
        return null;
      }

      return {
        key: key,
        rateLimit: allowedLimit,
        expiration: keyExpiration,
      };
    }),
  };

  const tokenAccessLogServiceMock = {
    getRateLimit: jest.fn().mockImplementation(() => usedLimit),
    logAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckAccessKeyMiddleware,
        UserKeyService,
        TokenAccessLogService,
      ],
    })
      .overrideProvider(UserKeyService)
      .useValue(userKeyServiceMock)
      .overrideProvider(TokenAccessLogService)
      .useValue(tokenAccessLogServiceMock)
      .compile();

    middleware = module.get<CheckAccessKeyMiddleware>(CheckAccessKeyMiddleware);
    keyExpiration = new Date();
    keyExpiration.setHours(new Date().getHours() + 1);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next if key is allowed', async () => {
    const req = httpMocks.createRequest({
      headers: {
        'x-app-key': key,
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.getHeader('X-Rate-Limit-Limit')).toEqual(
      allowedLimit.toString(),
    );
    expect(res.getHeader('X-Rate-Limit-Reset')).toBeDefined();
    expect(res.getHeader('X-Rate-Limit-Remaining')).toEqual(
      (allowedLimit - usedLimit - 1).toString(),
    );
  });

  it('should throw an error if key is not provided', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toThrowError(
      'Access key is required',
    );
  });

  it('should throw an error if key is invalid', async () => {
    const req = httpMocks.createRequest({
      headers: {
        'x-app-key': 'invalid',
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toThrowError(
      'Invalid access key',
    );

    expect(next).not.toHaveBeenCalled();
  });

  it('should throw an error if key is expired', async () => {
    const req = httpMocks.createRequest({
      headers: {
        'x-app-key': key,
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    keyExpiration = new Date();
    keyExpiration.setHours(new Date().getHours() - 1);

    await expect(middleware.use(req, res, next)).rejects.toThrowError(
      'Access key expired',
    );

    expect(next).not.toHaveBeenCalled();
  });

  it('should throw an error if rate limit is exceeded', async () => {
    usedLimit = allowedLimit;

    const req = httpMocks.createRequest({
      headers: {
        'x-app-key': key,
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await expect(middleware.use(req, res, next)).rejects.toThrowError(
      'Rate limit exceeded',
    );

    expect(next).not.toHaveBeenCalled();

    expect(res.getHeader('X-Rate-Limit-Limit')).toEqual(
      allowedLimit.toString(),
    );
    expect(res.getHeader('X-Rate-Limit-Reset')).toBeDefined();
    expect(res.getHeader('X-Rate-Limit-Remaining')).toEqual('0');
  });
});
