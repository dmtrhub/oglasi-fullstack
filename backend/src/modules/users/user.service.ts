import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private mapToDto = (user: User): UserResponseDto => {
    return {
      id: user.id,
      username: user.username,
      registeredAt: user.registeredAt,
      phone: user.phone,
    };
  };

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map(this.mapToDto);
  }

  async findOne(username: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`User '${username}' not found`);
    }
    return this.mapToDto(user);
  }

  async findOneForAuth(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'], // explicitly include password
    });
  }

  async findOneById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return this.mapToDto(user);
  }

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.usersRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.mapToDto(savedUser);
  }
}
