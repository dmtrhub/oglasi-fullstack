import { AdResponseDto } from './ad-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedAdsMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;
}

export class PaginatedAdsResponseDto {
  @ApiProperty({ type: [AdResponseDto] })
  data: AdResponseDto[];

  @ApiProperty()
  meta: PaginatedAdsMetaDto;
}
