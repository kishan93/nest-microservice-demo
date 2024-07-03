import { Test, TestingModule } from '@nestjs/testing';
import { UserKeyController } from './user-key.controller';
import { UserKeyService } from './user-key.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { UpdateUserKeyDto } from './dto/update-user-key.dto';

describe('UserKeyController', () => {
  let controller: UserKeyController;
  const mockUserKeyService = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
        key: 'randomGeneratedKey',
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn().mockResolvedValue(undefined),
    findUserKeyByUser: jest.fn().mockImplementation((userId) => ({
      userId,
      key: 'randomGeneratedKey',
      rateLimit: 100,
      expiration: new Date(),
    })),
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        userId: 1,
        key: 'randomGeneratedKey1',
        rateLimit: 100,
        expiration: new Date(),
      },
      {
        id: 2,
        userId: 2,
        key: 'randomGeneratedKey2',
        rateLimit: 100,
        expiration: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET ?? 'SECRET',
          signOptions: { expiresIn: '1h' },
          global: true,
        }),
      ],
      controllers: [UserKeyController],
      providers: [UserKeyService],
    })
      .overrideProvider(UserKeyService)
      .useValue(mockUserKeyService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<UserKeyController>(UserKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user key', async () => {
    const dto: CreateUserKeyDto = {
      userId: 1,
      rateLimit: 100,
      expiration: new Date(),
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
      key: expect.any(String),
    });
    expect(mockUserKeyService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user key', async () => {
    const dto: UpdateUserKeyDto = { rateLimit: 200, expiration: new Date() };
    expect(await controller.update('2', dto)).toEqual({
      id: 2,
      ...dto,
    });
    expect(mockUserKeyService.update).toHaveBeenCalledWith(2, dto);
  });

  it('should delete a user key', async () => {
    await expect(controller.remove('1')).resolves.toBeUndefined();
    expect(mockUserKeyService.remove).toHaveBeenCalledWith(1);
  });

  it('should find all user keys', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: expect.any(Number),
        userId: expect.any(Number),
        key: expect.any(String),
        rateLimit: expect.any(Number),
        expiration: expect.any(Date),
      },
      {
        id: expect.any(Number),
        userId: expect.any(Number),
        key: expect.any(String),
        rateLimit: expect.any(Number),
        expiration: expect.any(Date),
      },
    ]);
    expect(mockUserKeyService.findAll).toHaveBeenCalled();
  });
});
