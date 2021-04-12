import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  public create(createUserDto: CreateUserDto) {
    createUserDto.created = Date.now();
    return this.usersRepository.save(createUserDto);
  }

  public async findAll(from: number, size: number) {
    const [result, totalCount] = await this.usersRepository.findAndCount({
      take: size,
      skip: from,
    });
    return {
      result,
      totalCount,
      from,
      size,
    };
  }

  public findOne(id: string) {
    return this.usersRepository.findOne(+id);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    // because sqlite3 does not return a number of affected rows I have to check if the entry also exists https://stackoverflow.com/questions/24030383/getting-the-rows-affected-by-update-in-sqlite3-without-extra-query
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne(id);
  }

  public async remove(id: string) {
    // because sqlite3 does not return a number of affected rows I have to check if the entry also exists https://stackoverflow.com/questions/24030383/getting-the-rows-affected-by-update-in-sqlite3-without-extra-query
    const existingUser = await this.usersRepository.findOne(id);
    if (!existingUser) {
      return false;
    }
    await this.usersRepository.delete(id);
    return true;
  }
}
