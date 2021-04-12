import { IsAlpha, IsEmail, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsAlpha()
  givenName: string;

  @IsAlpha()
  familyName: string;

  @IsEmpty()
  created: number;
}
