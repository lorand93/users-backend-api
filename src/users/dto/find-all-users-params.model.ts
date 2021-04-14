import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllUsersParamsModel {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({description: 'Controls number of objects to skip from the beginning of the list', example: 0})
  public from: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({description: 'Controls the number of objects to return', example: 50})
  public size: string;
}
