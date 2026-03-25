import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { SeedService } from './url.seed';

@Module({
  controllers: [UrlController],
  providers: [UrlService, SeedService],
})
export class UrlModule {}
