import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  get(): Token {
    const token = new Token();
    token.id = '123';
    token.symbol = 'BTC';
    token.name = 'Bitcoin';
    token.platform = {
      ethereum: '0x123',
      polygon: '0x456',
    };
    return token;
  }
}
