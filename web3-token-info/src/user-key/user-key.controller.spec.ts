import { Test, TestingModule } from '@nestjs/testing';
import { UserKeyController } from './user-key.controller';
import { UserKeyService } from './user-key.service';

describe('UserKeyController', () => {
  let controller: UserKeyController;
  const mockUserKeyService = {
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserKeyController],
      providers: [UserKeyService],
    })
      .overrideProvider(UserKeyService)
      .useValue(mockUserKeyService)
      .compile();
    controller = module.get<UserKeyController>(UserKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete a user key', async () => {
    await expect(controller.remove('1')).resolves.toBeUndefined();
    expect(mockUserKeyService.remove).toHaveBeenCalledWith(1);
  });
});
