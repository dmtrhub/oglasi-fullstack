import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AdCategory } from '../enums/ad-category.enum';

export class CreateAdDto {
  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'Title of the ad',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Brand new iPhone in original packaging',
    description: 'Detailed description',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://example.com/phone.jpg',
    description: 'URL of the main image',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    example: 999.99,
    description: 'Price of the item',
    minimum: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    enum: AdCategory,
    example: AdCategory.TECHNOLOGY,
    description: 'Category of the ad',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AdCategory)
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  category: AdCategory;

  @ApiProperty({
    example: 'Belgrade',
    description: 'City where the item is located',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  city: string;
}
