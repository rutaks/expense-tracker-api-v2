import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true, default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFailedLoginAttempt: Date;

  @Column({ nullable: true })
  isBlocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  blockExpiryDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  constructor(
    username?: string,
    email?: string,
    phoneNumber?: string,
    password?: string,
    user?: User,
  ) {
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.user = user;
  }
}
