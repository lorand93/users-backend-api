import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllUsersInputModel {
  @IsOptional()
  @IsNumberString()
  public from: string;

  @IsOptional()
  @IsNumberString()
  public size: string;
}
