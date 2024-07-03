import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmSQLITETestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [...entities],
    synchronize: true,
  });
