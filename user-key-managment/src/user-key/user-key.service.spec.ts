import { Test, TestingModule } from '@nestjs/testing';
import { UserKeyService } from './user-key.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmSQLITETestingModule } from '../test-utils/TypeORMSQLITETestingModule';
import { UserKey } from './entities/user-key.entity';
import { Repository } from 'typeorm';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { UpdateUserKeyDto } from './dto/update-user-key.dto';
import { randomBytes } from 'crypto';

describe('UserKeyService', () => {
  let service: UserKeyService;
  let repository: Repository<UserKey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmSQLITETestingModule([UserKey]),
        TypeOrmModule.forFeature([UserKey]),
      ],
      providers: [
        {
          provide: getRepositoryToken(UserKey),
          useClass: Repository<UserKey>,
        },
      ],
    }).compile();

    repository = module.get<Repository<UserKey>>(getRepositoryToken(UserKey));
    service = new UserKeyService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a user key', async () => {
    const dto: CreateUserKeyDto = {
      userId: 1,
      rateLimit: 100,
      expiration: new Date(),
    };
    const result = await service.create(dto);

    expect(result).toEqual({
      id: expect.any(Number),
      key: expect.any(String),
      ...dto,
    });

    const savedKey = await repository.findOne({ where: { userId: 1 } });
    expect(savedKey).toBeDefined();
  });

  it('should update a user key', async () => {
    const dto: CreateUserKeyDto = {
      userId: 1,
      rateLimit: 100,
      expiration: new Date(),
    };
    const key = repository.create({
      ...dto,
      key: randomBytes(32).toString('hex'),
    });
    const createdKey = await repository.save(key);

    const updateDto: UpdateUserKeyDto = {
      rateLimit: 200,
      expiration: new Date(),
    };
    await service.update(createdKey.id, updateDto);

    const updatedKey = await repository.findOne({
      where: { id: createdKey.id },
    });

    expect(updatedKey.rateLimit).toBe(updateDto.rateLimit);
    expect(updatedKey.expiration.toString()).toBe(
      updateDto.expiration.toString(),
    );
  });

  it('should delete a user key', async () => {
    const dto: CreateUserKeyDto = {
      userId: 1,
      rateLimit: 100,
      expiration: new Date(),
    };
    const key = repository.create({
      ...dto,
      key: randomBytes(32).toString('hex'),
    });
    const createdKey = await repository.save(key);

    await service.remove(createdKey.id);
    const deletedKey = await repository.findOne({
      where: { id: createdKey.id },
    });
    expect(deletedKey).toBeNull();
  });

  it('should find all user keys', async () => {
    const dto1: CreateUserKeyDto = {
      userId: 1,
      rateLimit: 100,
      expiration: new Date(),
    };
    const dto2: CreateUserKeyDto = {
      userId: 2,
      rateLimit: 100,
      expiration: new Date(),
    };

    const key1 = repository.create({
      ...dto1,
      key: randomBytes(32).toString('hex'),
    });
    await repository.save(key1);

    const key2 = repository.create({
      ...dto2,
      key: randomBytes(32).toString('hex'),
    });
    await repository.save(key2);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: expect.any(Number),
        userId: 1,
        key: key1.key,
        rateLimit: 100,
        expiration: expect.any(Date),
      },
      {
        id: expect.any(Number),
        userId: 2,
        key: key2.key,
        rateLimit: 100,
        expiration: expect.any(Date),
      },
    ]);
  });
});
