import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique user identifier'
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username'
  })
  username: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Registration date'
  })
  registeredAt: Date;

  @ApiProperty({
    example: '+381601234567',
    description: 'User phone number'
  })
  phone: string;
}