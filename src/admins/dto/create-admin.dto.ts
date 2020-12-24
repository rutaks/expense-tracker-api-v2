import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MobilePlatform } from '../../users/enums/mobile-platform.enum';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Invalid IMEI' })
  signupDeviceIMEI?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(MobilePlatform, { message: 'Invalid mobile platform' })
  signupDevicePlatform?: string;
}
