import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserMobileInformation } from './user-mobile-information.entity';
import BaseEntity from '../../shared/interfaces/base-entity.entity';
import { Gender } from '../enums/gender.enum';

@Entity({ name: 'users' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  profilePictureUrl: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  gender: Gender;

  @ApiProperty()
  @Column({ nullable: true })
  dob: Date;

  @OneToOne(() => UserMobileInformation)
  @JoinColumn()
  mobileInformation: UserMobileInformation;

  constructor(data?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    super();
    /* istanbul ignore next */
    if (data) {
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    }
  }
}
