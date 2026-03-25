import { Injectable, OnModuleInit } from '@nestjs/common';
import { UrlService } from './url.service';

const SEED_URLS = [
  'https://www.google.com',
  'https://www.github.com',
  'https://www.nestjs.com',
  'https://www.typescriptlang.org',
  'https://www.wikipedia.org',
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly urlService: UrlService) {}

  onModuleInit(): void {
    if (process.env.SEED !== 'true') return;

    for (const url of SEED_URLS) {
      const { short_url } = this.urlService.shortenUrl(url);
      const redirectCount = randomBetween(10, 1000);
      this.urlService.seedRedirectCount(short_url, redirectCount);
    }
  }
}
