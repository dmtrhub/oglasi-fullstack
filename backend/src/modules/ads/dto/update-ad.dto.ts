import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AdCategory } from '../enums/ad-category.enum';

export class UpdateAdDto {
  @ApiPropertyOptional({
    example: 'iPhone 13 Pro Max',
    description: 'Updated title of the ad'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Brand new, never opened',
    description: 'Updated description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/new-image.jpg',
    description: 'Updated image URL'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 1099.99,
    description: 'Updated price',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    enum: AdCategory,
    example: AdCategory.SPORTS,
    description: 'Updated category'
  })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsEnum(AdCategory)
  category?: AdCategory;

  @ApiPropertyOptional({
    example: 'Novi Sad',
    description: 'Updated city location'
  })
  @IsOptional()
  @IsString()
  city?: string;
}