import {
  ValidateIf,
  IsPhoneNumber,
  IsNotEmpty,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @ValidateIf(v => v.phoneNumber === undefined)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty()
  @ValidateIf(v => v.email === undefined)
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('RW', { message: 'Invalid phone number' })
  phoneNumber?: string;
}

export class ConfirmResetDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'New Password is required' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'new Password is weak, should have special characters and lower/upper letters',
  })
  newPassword: string;
}
