import { Injectable } from '@nestjs/common';
import { UrlData } from './interfaces/url-data.interface';
import * as base62Utils from 'src/common/utils/base62.util';
import { SnowflakeId } from '@street-devs/snowflake-id';
import { UrlResponseDto } from './dtos/url-response.dto';
const BASE_URL = 'http://localhost:3000';
const snowflake = new SnowflakeId();
@Injectable()
export class UrlService {
  private readonly urls: Map<string, UrlData> = new Map();
  private readonly shortenedUrls: Map<string, string> = new Map();

  getAllUrls(): UrlData[] {
    return Array.from(this.urls.values());
  }

  shortenUrl(url: string): UrlResponseDto {
    // check if url exists in shortenedUrls
    if (this.shortenedUrls.has(url)) {
      const encodedUrl = this.shortenedUrls.get(url);
      const shortUrl = `${BASE_URL}/${encodedUrl}`;
      return {
        short_url: shortUrl,
      };
    }

    // generate short id
    const id = snowflake.generate();
    // encode id to base62 and add it to the base url
    const shortId = base62Utils.encode(id);
    const shortUrl = `${BASE_URL}/${shortId}`;
    // set the short url in the shortenedUrls map
    this.shortenedUrls.set(url, shortUrl);
    // set the url data in the urls map
    this.urls.set(shortUrl, {
      id: id,
      short_url: shortUrl,
      long_url: url,
      created_at: new Date(),
      redirect_count: 0,
    });

    return {
      short_url: shortUrl,
    };
  }
}
