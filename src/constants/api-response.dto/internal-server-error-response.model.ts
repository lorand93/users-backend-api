import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class InternalServerErrorResponseModel {
  @ApiModelProperty({ description: 'Error message', type: 'string' })
  message: string;

  @ApiModelProperty({ description: 'Error message', type: 'string'})
  error: string;
}
