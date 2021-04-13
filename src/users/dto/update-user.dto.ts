import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  constructor(obj: Partial<UpdateUserDto>) {
    if (obj) {
      this.id = obj.id;
      this.email = obj.email;
      this.givenName = obj.givenName;
      this.familyName = obj.familyName;
    }
  }

  @IsOptional()
  id: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  givenName: string;

  @IsString()
  @IsOptional()
  familyName: string;
}
