import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Response,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersParamsModel } from './dto/find-all-users-params.model';
import { Response as Res } from 'express';
import { UsersApiMessages } from '../constants/users-api-messages';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IValidationFailedResponse } from '../constants/validation-failed-response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({type: CreateUserDto})
  @ApiOkResponse({description: 'Created User', type: User})
  @ApiBadRequestResponse({description: 'Validation failed response', type: IValidationFailedResponse})
  public async create(@Body() createUserDto: CreateUserDto, @Response() response: Res) {
    try {
      const result = await this.usersService.create(createUserDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      console.error(`${UsersApiMessages.ERROR_WHILE_CREATING_NEW_USER}, error: ${e ? e.toString() : ''}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: UsersApiMessages.ERROR_WHILE_CREATING_NEW_USER,
        error: e ? e.toString() : '',
      });
    }
  }

  @Get()
  public async findAll(@Query() params: FindAllUsersParamsModel, @Response() response: Res) {
    if (params.from && !params.size) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.MISSING_PAGING_PARAMS,
      });
    }

    if (params.size && !params.from) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.MISSING_PAGING_PARAMS,
      });
    }

    if (params.size && parseInt(params.size, 10) > 100) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.PAGING_SIZE_TOO_LARGE,
      });
    }

    try {
      const result = await this.usersService.findAll(
        parseInt(params.from, 10) || 0,
        parseInt(params.size, 10) || 10,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.error(`${UsersApiMessages.ERROR_WHILE_GETTING_USERS}, error: ${e ? e.toString() : ''}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: UsersApiMessages.ERROR_WHILE_GETTING_USERS,
        error: e ? e.toString() : '',
      });
    }
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Response() response: Res) {
    if (!id) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.INVALID_ID,
      });
    }

    try {
      const result = await this.usersService.findOne(id);
      if (!result) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: UsersApiMessages.USER_NOT_FOUND,
          id,
        });
      }
      return response.status(HttpStatus.OK).json(result);

    } catch (e) {
      console.error(`${UsersApiMessages.ERROR_WHILE_GETTING_USER} ${id}, error: ${e ? e.toString() : ''}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: UsersApiMessages.ERROR_WHILE_GETTING_USER + id,
        error: e ? e.toString() : '',
      });
    }
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Response() response: Res,
  ) {
    if (!id) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.INVALID_ID,
        id,
      });
    }

    try {
      const result = await this.usersService.update(id, updateUserDto);
      if (!result) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: UsersApiMessages.INVALID_ID,
          id,
        });
      }
      return response.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.error(`${UsersApiMessages.ERROR_WHILE_UPDATING_USER} ${id}, error: ${e ? e.toString() : ''}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: UsersApiMessages.ERROR_WHILE_UPDATING_USER + id,
        error: e ? e.toString() : '',
      });
    }
  }

  @Delete(':id')
  public async remove(@Param('id') id: string, @Response() response: Res) {
    if (!id || parseInt(id, 10) <= 0) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: UsersApiMessages.INVALID_ID,
        id,
      });
    }

    try {
      const result = await this.usersService.remove(id);
      if (!result) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: UsersApiMessages.NO_USER_DELETED,
          id,
        });
      }

      return response.status(HttpStatus.OK).json();
    } catch (e) {
      console.error(`${UsersApiMessages.ERROR_WHILE_DELETING_USER} ${id}, error: ${e ? e.toString() : ''}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: UsersApiMessages.ERROR_WHILE_DELETING_USER + id,
        error: e ? e.toString() : '',
      });
    }
  }
}
