import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public create(createUserDto: CreateUserDto) {
    createUserDto.created = Date.now();
    return this.usersRepository.save(createUserDto);
  }

  public findAll() {
    return this.usersRepository.find();
  }

  public findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  public async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
