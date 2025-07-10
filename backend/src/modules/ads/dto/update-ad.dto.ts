import { IsOptional, IsString, IsUrl, IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AdCategory } from '../enums/ad-category.enum';

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsEnum(AdCategory)
  category?: AdCategory;

  @IsOptional()
  @IsString()
  city?: string;
}
