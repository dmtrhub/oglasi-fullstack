import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './ad.entity';
import { User } from '../users/user.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { AdResponseDto } from './dto/ad-response.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(Ad)
    private adsRepository: Repository<Ad>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAdDto: CreateAdDto, userId: string): Promise<AdResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) 
      throw new NotFoundException(`User with id ${userId} not found`);

    const ad = this.adsRepository.create({
      ...createAdDto,
      user,
    });

    const saved = await this.adsRepository.save(ad);

    return this.mapToDto(saved);
  }

  async findAll(): Promise<AdResponseDto[]> {
    const ads = await this.adsRepository.find({
      relations: ['user'],
    });

    return ads.map(ad => this.mapToDto(ad));
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
    dto: UpdateAdDto,
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
      throw new UnauthorizedException('You are not the owner of this ad.');
    }

    Object.assign(ad, dto);
    const updated = await this.adsRepository.save(ad);
    return this.mapToDto(updated);
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
      throw new UnauthorizedException('You are not the owner of this ad.');
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
