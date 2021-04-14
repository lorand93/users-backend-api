import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({description: 'Email of user', example: 'mike.millers@email.com'})
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Given name of user', example: 'Mike'})
  givenName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Family name of user', example: 'Millers'})
  familyName: string;

  @IsEmpty()
  created: number;
}
