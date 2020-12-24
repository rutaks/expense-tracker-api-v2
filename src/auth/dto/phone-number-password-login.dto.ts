import { IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneNumberPasswordLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('RW', { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is weak, should have special characters and lower/upper letters',
  })
  password: string;
}
