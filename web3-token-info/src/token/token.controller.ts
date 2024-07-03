import { Controller, Get, Param, Delete } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @Get()
  get() { }

  @Delete(':id')
  remove(@Param('id') id: string) { }
}
