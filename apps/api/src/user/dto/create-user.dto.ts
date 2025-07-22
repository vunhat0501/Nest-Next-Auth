import { IsEmail, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @Min(1)
  password!: string;
}
