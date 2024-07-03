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

  @Column({ type: 'timestamptz' })
  expiration: Date;
}
