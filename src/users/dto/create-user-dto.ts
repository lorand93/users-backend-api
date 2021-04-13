import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  constructor(obj: Partial<CreateUserDto>) {
    if (obj) {
      this.email = obj.email;
      this.givenName = obj.givenName;
      this.familyName = obj.familyName;
      this.created = obj.created;
    }
  }

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
