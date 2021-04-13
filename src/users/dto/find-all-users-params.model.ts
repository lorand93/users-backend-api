import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllUsersParamsModel {
  @IsOptional()
  @IsNumberString()
  public from: string;

  @IsOptional()
  @IsNumberString()
  public size: string;
}
