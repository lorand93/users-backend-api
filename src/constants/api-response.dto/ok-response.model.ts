import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from '../../entities/user.entity';

export class OkResponseModel {
  @ApiModelProperty({ description: 'List of users', type: [User] })
  result: User[];
  @ApiProperty({ description: 'Total count of users in db', example: 25 })
  totalCount: number;
  @ApiProperty({ description: '[Pagination] Number of skipped users', example: 0 })
  from: number;
  @ApiProperty({ description: '[Pagination] Number of users to retrieve users', example: 50 })
  size: number;
}
