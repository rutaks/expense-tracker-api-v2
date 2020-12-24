import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
