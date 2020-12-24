import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty()
  url: string;
  token: string;
}

export class ConfirmResetPasswordResponseDto {
  @ApiProperty()
  data: Record<string, any>;
}
