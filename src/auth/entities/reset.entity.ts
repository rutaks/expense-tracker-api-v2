import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Auth } from './auth.entity';

@Entity()
export class Reset {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  token: string;

  @ApiProperty()
  @Column({ nullable: true })
  expiryDate: Date;

  @OneToOne(() => Auth)
  @JoinColumn()
  auth: Auth;
}
