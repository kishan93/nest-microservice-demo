import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TokenAccessLog {
  @PrimaryGeneratedColumn()
  id: number;

  //indexed key
  @Index()
  @Column()
  key: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  success: boolean;
}
