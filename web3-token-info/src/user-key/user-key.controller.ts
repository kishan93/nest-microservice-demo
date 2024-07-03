import { Controller, Param, Delete } from '@nestjs/common';
import { UserKeyService } from './user-key.service';

@Controller('user-key')
export class UserKeyController {
  constructor(private readonly userKeyService: UserKeyService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userKeyService.remove(+id);
  }
}
