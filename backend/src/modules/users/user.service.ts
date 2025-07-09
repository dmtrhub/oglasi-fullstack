import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
        throw new NotFoundException(`User '${username}' not found`);
    }

    return user;
  }

  create(userDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(userDto);
    return this.usersRepository.save(newUser);
  }
}
