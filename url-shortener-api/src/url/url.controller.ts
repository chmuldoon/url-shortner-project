import { Controller, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { UrlResponseDto } from './dtos/url-response.dto';
import { Body, Redirect, Response } from '@nestjs/common';
import { UrlData } from './interfaces/url-data.interface';
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  shortenUrl(@Body() body: ShortenUrlDto): UrlResponseDto {
    return this.urlService.shortenUrl(body.url);
  }

  @Get('urls')
  getAllUrls(): UrlData[] {
    return this.urlService.getAllUrls();
  }

  @Get(':shortUrl')
  @Redirect()
  redirectToUrl(@Param('shortUrl') shortUrl: string) {
    const longUrl = this.urlService.redirectToUrl(shortUrl);
    return {
      url: longUrl,
      statusCode: 302,
    };
  }
}
