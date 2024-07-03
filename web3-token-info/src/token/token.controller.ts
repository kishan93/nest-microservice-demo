import { Controller, Get, Param, Delete } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  get(): Token {
    return this.tokenService.get();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
