import { IsEnum, IsNotEmpty, IsString, IsNumber, IsUrl, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { AdCategory } from '../enums/ad-category.enum';

export class CreateAdDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsEnum(AdCategory)
  @Transform(({ value }) => value?.toLowerCase())
  category: AdCategory;

  @IsNotEmpty()
  @IsString()
  city: string;
}
