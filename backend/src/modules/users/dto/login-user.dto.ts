import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}