import { User } from 'src/users/entities/user.entity';
import { ChildEntity } from 'typeorm';

@ChildEntity()
export class Consumer extends User {}
