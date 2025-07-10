import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  applyDecorators,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { AdResponseDto } from './dto/ad-response.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { GetAdsFilterDto } from './dto/get-ads-filter.dto';
import { GetMyAdsDto } from './dto/get-my-ads.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { PaginatedAdsResponseDto } from './dto/paginated-ads-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Ads')
@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ads with filtering and pagination' })
  @ApiResponse({ 
    status: 200,
    description: 'Paginated and filtered ads',
    type: PaginatedAdsResponseDto,
  })
  async findAll(
    @Query() filterDto: GetAdsFilterDto,
  ): Promise<PaginatedAdsResponseDto> {
    return this.adService.findAll(filterDto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user ads with same filtering options' })
  @ApiResponse({ 
    status: 200,
    description: 'Paginated and filtered current user ads',
    type: PaginatedAdsResponseDto,
  })
  async findMyAds(
    @Query() filterDto: GetMyAdsDto,
    @Request() req,
  ): Promise<PaginatedAdsResponseDto> {
    return this.adService.findMyAds(filterDto, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ad by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The found ad',
    type: AdResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  findOne(@Param('id') id: string): Promise<AdResponseDto> {
    return this.adService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ad' })
  @ApiResponse({ 
    status: 201, 
    description: 'The created ad',
    type: AdResponseDto,
  })
  create(
    @Body() createAdDto: CreateAdDto,
    @Request() req,
  ): Promise<AdResponseDto> {
    return this.adService.create(createAdDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an ad' })
  @ApiResponse({ 
    status: 200, 
    description: 'The updated ad',
    type: AdResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 403, description: 'Not the owner of the ad' })
  update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @Request() req,
  ): Promise<AdResponseDto> {
    return this.adService.update(id, updateAdDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an ad' })
  @ApiResponse({ status: 200, description: 'Ad deleted' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @ApiResponse({ status: 403, description: 'Not the owner of the ad' })
  delete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<void> {
    return this.adService.delete(id, req.user.userId);
  }
}