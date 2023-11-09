import { IsEmail } from 'class-validator';

export class CreateUserDto {
  readonly username: string;

  @IsEmail()
  readonly email: string;

  readonly password: string;
}
