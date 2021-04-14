import { ApiProperty } from '@nestjs/swagger';

export abstract class IValidationFailedResponse {
  @ApiProperty({description: 'Status code', example: '400'})
  statusCode: number;
  @ApiProperty({description: 'List of failed validations'})
  message: string[];
  @ApiProperty({description: 'Error name', example: 'Bad Request'})
  error: string;
}
