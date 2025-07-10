import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './ad.entity';
import { User } from '../users/user.entity';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User]), UserModule],
  providers: [AdService],
  controllers: [AdController],
})
export class AdModule {}
