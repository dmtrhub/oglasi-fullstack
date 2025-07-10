import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { AdResponseDto } from './dto/ad-response.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Controller('ads')
export class AdController {
  constructor(private readonly adsService: AdService) {}

  @Get()
  findAll(): Promise<AdResponseDto[]> {
    return this.adsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  findMyAds(@Request() req): Promise<AdResponseDto[]> {
    return this.adsService.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdResponseDto> {
    return this.adsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAdDto, @Request() req): Promise<AdResponseDto> {
    return this.adsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
    @Request() req,
  ): Promise<AdResponseDto> {
    return this.adsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.adsService.delete(id, req.user.userId);
  }
}
