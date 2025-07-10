import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { AdCategory } from '../enums/ad-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AdResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier of the ad'
  })
  id: string;

  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'Title of the ad'
  })
  title: string;

  @ApiProperty({
    example: 'Brand new iPhone in original packaging',
    description: 'Detailed description of the ad'
  })
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'Price of the item',
    minimum: 0
  })
  price: number;

  @ApiProperty({
    example: 'https://example.com/phone.jpg',
    description: 'URL of the main image'
  })
  imageUrl: string;

  @ApiProperty({
    enum: AdCategory,
    example: AdCategory.TECHNOLOGY,
    description: 'Category of the ad'
  })
  category: AdCategory;

  @ApiProperty({
    example: 'Belgrade',
    description: 'City where the item is located'
  })
  city: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date of the ad'
  })
  createdAt: Date;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User who created the ad'
  })
  user: UserResponseDto;
}