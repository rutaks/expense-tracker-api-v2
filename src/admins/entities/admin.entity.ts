import { ChildEntity, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AdminType } from '../enums/admin-type.enum';

@ChildEntity()
export class Admin extends User {
  @Column('text')
  type: AdminType;
}
