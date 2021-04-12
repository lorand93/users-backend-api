import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  givenName: string;

  @IsString()
  @IsNotEmpty()
  familyName: string;

  @IsEmpty()
  created: number;
}
