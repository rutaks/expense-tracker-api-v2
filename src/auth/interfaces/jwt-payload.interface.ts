import { User } from '../../users/entities/user.entity';

export interface JwtPayload {
  user: User;
}
