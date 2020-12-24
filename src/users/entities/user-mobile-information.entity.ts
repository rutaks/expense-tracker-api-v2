import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MobilePlatform } from '../enums/mobile-platform.enum';
import { User } from './user.entity';

@Entity()
export class UserMobileInformation {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  signupDeviceIMEI: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  signupDevicePlatform: MobilePlatform;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;
}
