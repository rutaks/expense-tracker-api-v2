import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  user: User;
  @ApiProperty()
  accessToken: string;
  refreshToken?: string;
}
