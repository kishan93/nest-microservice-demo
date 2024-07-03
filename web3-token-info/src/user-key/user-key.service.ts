import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserKey } from './entities/user-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserKeyService {
  constructor(
    @InjectRepository(UserKey) private userKeyRepo: Repository<UserKey>,
  ) {}

  find(key: string) {
    return this.userKeyRepo.findOneBy({ key });
  }

  async remove(id: number) {
    await this.userKeyRepo.delete(id);
  }
}
