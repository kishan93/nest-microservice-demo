import { Injectable } from '@nestjs/common';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { UpdateUserKeyDto } from './dto/update-user-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserKey } from './entities/user-key.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'; // Import crypto

@Injectable()
export class UserKeyService {
  constructor(
    @InjectRepository(UserKey) private userKeyRepo: Repository<UserKey>,
  ) {}

  create(createUserKeyDto: CreateUserKeyDto) {
    const key = this.userKeyRepo.create({
      ...createUserKeyDto,
      key: this.generateUniqueKey(),
    });
    return this.userKeyRepo.save(key);
  }

  findAll() {
    return this.userKeyRepo.find();
  }

  findOne(id: number) {
    return this.userKeyRepo.findOneBy({ id });
  }

  findByUserId(userId: number) {
    return this.userKeyRepo.findBy({ userId });
  }

  async update(id: number, updateUserKeyDto: UpdateUserKeyDto) {
    await this.userKeyRepo.update(id, updateUserKeyDto);
    return this.userKeyRepo.findOneBy({ id });
  }

  async remove(id: number) {
    await this.userKeyRepo.delete(id);
  }

  private generateUniqueKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
