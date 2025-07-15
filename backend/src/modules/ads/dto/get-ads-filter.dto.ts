import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { AdCategory } from '../enums/ad-category.enum';
import { Transform } from 'class-transformer';

export class GetAdsFilterDto {
  @ApiPropertyOptional({
    enum: AdCategory,
    example: AdCategory.TECHNOLOGY,
    description: 'Filter by category',
  })
  @IsOptional()
  @IsEnum(AdCategory)
  category?: AdCategory;

  @ApiPropertyOptional({
    example: 'iPhone',
    description: 'Filter by title (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  title?: string;

  @ApiPropertyOptional({
    example: 'Belgrade',
    description: 'Filter by city (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  city?: string;

  @ApiPropertyOptional({
    example: '100',
    description: 'Minimum price filter',
  })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({
    example: '1000',
    description: 'Maximum price filter',
  })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for pagination',
    default: '1',
  })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';
}
