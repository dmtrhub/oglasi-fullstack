import { AdCategory } from '../enums/ad-category.enum';

export class AdResponseDto {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: AdCategory;
  city: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    registeredAt: Date;
    phone: string;
  };
}
