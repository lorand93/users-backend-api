import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllUsersInputModel {
  @IsOptional()
  @IsNumberString()
  from: string;

  @IsOptional()
  @IsNumberString()
  size: string;
}
