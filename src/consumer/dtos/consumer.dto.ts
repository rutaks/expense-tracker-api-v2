import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/users/enums/gender.enum';

export class ConsumerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('RW', { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate({ message: 'Invalid date of birth' })
  dob: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is weak, should between 4-20 characters should have special characters and lower/upper letters a atleast one digit',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, { message: 'Invalid Gender' })
  gender: Gender;
}
