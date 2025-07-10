import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './ad.entity';
import { User } from '../users/user.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { AdResponseDto } from './dto/ad-response.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { GetAdsFilterDto } from './dto/get-ads-filter.dto';
import { PaginatedAdsResponseDto } from './dto/paginated-ads-response.dto';
import { GetMyAdsDto } from './dto/get-my-ads.dto';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(Ad)
    private adsRepository: Repository<Ad>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAdDto: CreateAdDto, userId: string): Promise<AdResponseDto> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const ad = this.adsRepository.create({
      ...createAdDto,
      user,
    });

    const savedAd = await this.adsRepository.save(ad);
    return this.mapToDto(savedAd);
  }

  async findAll(
  filterDto: GetAdsFilterDto,
  ): Promise<PaginatedAdsResponseDto> {
    const {
      category,
      title,
      city,
      minPrice,
      maxPrice,
      page = '1',
    } = filterDto;

    const take = 20;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * take;

    const query = this.adsRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .orderBy('ad.id', 'ASC');

    // Filtering
    if (category) query.andWhere('ad.category = :category', { category });

    if (title) query.andWhere('LOWER(ad.title) LIKE :title', { 
      title: `%${title.toLowerCase().trim()}%` 
    });

    if (city) query.andWhere('LOWER(ad.city) LIKE :city', { 
      city: `%${city.toLowerCase().trim()}%` 
    });

    if (minPrice) query.andWhere('ad.price >= :minPrice', { 
      minPrice: parseFloat(minPrice) 
    });
    if (maxPrice) query.andWhere('ad.price <= :maxPrice', { 
      maxPrice: parseFloat(maxPrice) 
    });

    // Pagination
    const [ads, total] = await query
      .offset(skip)
      .limit(take)
      .getManyAndCount();

    return {
      data: ads.map(ad => this.mapToDto(ad)),
      meta: {
        total,
        page: currentPage,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findMyAds(
  filterDto: GetMyAdsDto,
  userId: string,
  ): Promise<PaginatedAdsResponseDto> {
    const query = this.adsRepository
      .createQueryBuilder('ad')
      .innerJoinAndSelect('ad.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('ad.id', 'ASC');

    if (filterDto.category) {
      query.andWhere('ad.category = :category', { 
        category: filterDto.category 
      });
    }

    if (filterDto.title) query.andWhere('LOWER(ad.title) LIKE :title', { 
      title: `%${filterDto.title.toLowerCase().trim()}%` 
    });

    if (filterDto.city) query.andWhere('LOWER(ad.city) LIKE :city', { 
      city: `%${filterDto.city.toLowerCase().trim()}%` 
    });

    if (filterDto.minPrice) query.andWhere('ad.price >= :minPrice', { 
      minPrice: parseFloat(filterDto.minPrice) 
    });
    if (filterDto.maxPrice) query.andWhere('ad.price <= :maxPrice', { 
      maxPrice: parseFloat(filterDto.maxPrice) 
    });

    const take = 20;
    const currentPage = parseInt(filterDto.page || '1');
    const skip = (currentPage - 1) * take;

    const [ads, total] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data: ads.map(ad => this.mapToDto(ad)),
      meta: {
        total,
        page: currentPage,
        lastPage: Math.ceil(total / take),
      },
    };
  }


  async findOne(id: string): Promise<AdResponseDto> {
    const ad = await this.adsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!ad) {
      throw new NotFoundException(`Ad with id ${id} not found`);
    }

    return this.mapToDto(ad);
  }

  async findByUserId(userId: string): Promise<AdResponseDto[]> {
    const ads = await this.adsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return ads.map(ad => this.mapToDto(ad));
  }

  async update(
    id: string,
    updateAdDto: UpdateAdDto,
    userId: string,
  ): Promise<AdResponseDto> {
    const ad = await this.adsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!ad) {
      throw new NotFoundException(`Ad with id ${id} not found`);
    }

    if (ad.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this ad');
    }

    Object.assign(ad, updateAdDto);
    const updatedAd = await this.adsRepository.save(ad);
    return this.mapToDto(updatedAd);
  }

  async delete(id: string, userId: string): Promise<void> {
    const ad = await this.adsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!ad) {
      throw new NotFoundException(`Ad with id ${id} not found`);
    }

    if (ad.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this ad');
    }

    await this.adsRepository.remove(ad);
  }

  private mapToDto(ad: Ad): AdResponseDto {
    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      price: ad.price,
      category: ad.category,
      city: ad.city,
      createdAt: ad.createdAt,
      user: {
        id: ad.user.id,
        username: ad.user.username,
        registeredAt: ad.user.registeredAt,
        phone: ad.user.phone,
      },
    };
  }
}