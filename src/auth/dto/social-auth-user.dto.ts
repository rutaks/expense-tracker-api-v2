import { ApiProperty } from '@nestjs/swagger';

export class SocialAuthUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  accessToken: string;
}
