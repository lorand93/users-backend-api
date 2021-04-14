import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional()
  id: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  givenName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  familyName: string;
}
