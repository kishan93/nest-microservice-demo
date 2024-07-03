import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  key: string;

  @Column()
  rateLimit: number;

  @Column({ type: process.env.NODE_ENV == 'test' ? 'datetime' : 'timestamptz' })
  expiration: Date;
}
