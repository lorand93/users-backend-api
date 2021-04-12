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
    return this.usersRepository.findOne(id);
  }

  public update(id: string, updateUserDto: UpdateUserDto) {
    const result = this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne(id);
  }

  public async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
