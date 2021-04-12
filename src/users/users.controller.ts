import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { FindAllUsersInputModel } from './dto/find-all-users.input.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  public async create(@Body() createUserDto: UserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  public async findAll(@Query() params: FindAllUsersInputModel) {
    const users = await this.usersService.findAll(
      parseInt(params.from, 10) || 0,
      parseInt(params.size, 10) || 10,
    );
    return users;
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
