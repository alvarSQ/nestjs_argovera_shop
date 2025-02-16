import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly role?: string;

  @IsNotEmpty()
  readonly password: string;
}
