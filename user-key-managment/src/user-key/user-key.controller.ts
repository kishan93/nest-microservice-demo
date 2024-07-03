import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserKeyService } from './user-key.service';
import { CreateUserKeyDto } from './dto/create-user-key.dto';
import { UpdateUserKeyDto } from './dto/update-user-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-key')
@UseGuards(JwtAuthGuard)
export class UserKeyController {
  constructor(private readonly userKeyService: UserKeyService) {}

  @Post()
  create(@Body() createUserKeyDto: CreateUserKeyDto) {
    return this.userKeyService.create(createUserKeyDto);
  }

  @Get()
  findAll() {
    return this.userKeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userKeyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserKeyDto: UpdateUserKeyDto) {
    return this.userKeyService.update(+id, updateUserKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userKeyService.remove(+id);
  }
}
