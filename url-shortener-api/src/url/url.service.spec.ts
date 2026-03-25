import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUrls()', () => {
    it('should return an empty array when no URLs have been shortened', () => {
      expect(service.getAllUrls()).toEqual([]);
    });

    it('should return all shortened URLs', () => {
      service.shortenUrl('https://example.com');
      service.shortenUrl('https://google.com');

      const urls = service.getAllUrls();

      expect(urls).toHaveLength(2);
      expect(urls.map((u) => u.long_url)).toContain('https://example.com');
      expect(urls.map((u) => u.long_url)).toContain('https://google.com');
    });

    it('should return URL data with the expected shape', () => {
      service.shortenUrl('https://example.com');

      const [urlData] = service.getAllUrls();

      expect(urlData).toHaveProperty('id');
      expect(urlData).toHaveProperty('short_url');
      expect(urlData).toHaveProperty('long_url', 'https://example.com');
      expect(urlData).toHaveProperty('created_at');
      expect(urlData).toHaveProperty('redirect_count', 0);
      expect(urlData.created_at).toBeInstanceOf(Date);
    });
  });

  describe('shortenUrl()', () => {
    it('should return a short_url for a valid http URL', () => {
      const result = service.shortenUrl('http://example.com');

      expect(result).toHaveProperty('short_url');
      expect(result.short_url).toMatch(/^http:\/\/localhost:3000\/.+/);
    });

    it('should return a short_url for a valid https URL', () => {
      const result = service.shortenUrl('https://example.com');

      expect(result).toHaveProperty('short_url');
      expect(result.short_url).toMatch(/^http:\/\/localhost:3000\/.+/);
    });

    it('should return the same short_url when the same URL is shortened twice', () => {
      const first = service.shortenUrl('https://example.com');
      const second = service.shortenUrl('https://example.com');

      expect(first.short_url).toBe(second.short_url);
    });

    it('should return different short_urls for different input URLs', () => {
      const first = service.shortenUrl('https://example.com');
      const second = service.shortenUrl('https://google.com');

      expect(first.short_url).not.toBe(second.short_url);
    });

    it('should not create a duplicate entry when the same URL is shortened twice', () => {
      service.shortenUrl('https://example.com');
      service.shortenUrl('https://example.com');

      expect(service.getAllUrls()).toHaveLength(1);
    });

    it('should add the URL to the store after shortening', () => {
      service.shortenUrl('https://example.com');

      const urls = service.getAllUrls();

      expect(urls).toHaveLength(1);
      expect(urls[0].long_url).toBe('https://example.com');
    });

    it('should throw BadRequestException for a URL without a protocol', () => {
      expect(() => service.shortenUrl('example.com')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for an empty string', () => {
      expect(() => service.shortenUrl('')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for a plaintext string', () => {
      expect(() => service.shortenUrl('not-a-url')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with message "Invalid URL"', () => {
      expect(() => service.shortenUrl('not-a-url')).toThrow('Invalid URL');
    });
  });

  describe('redirectToUrl()', () => {
    it('should return the original long URL for a known short code', () => {
      const { short_url } = service.shortenUrl('https://example.com');
      const shortCode = short_url.replace('http://localhost:3000/', '');

      const result = service.redirectToUrl(shortCode);

      expect(result).toBe('https://example.com');
    });

    it('should increment the redirect_count by 1 on each call', () => {
      const { short_url } = service.shortenUrl('https://example.com');
      const shortCode = short_url.replace('http://localhost:3000/', '');

      service.redirectToUrl(shortCode);
      service.redirectToUrl(shortCode);

      const urlData = service
        .getAllUrls()
        .find((u) => u.short_url === short_url);
      expect(urlData?.redirect_count).toBe(2);
    });

    it('should start with redirect_count of 0 before any redirects', () => {
      service.shortenUrl('https://example.com');

      const urlData = service.getAllUrls()[0];
      expect(urlData.redirect_count).toBe(0);
    });

    it('should throw NotFoundException for an unknown short code', () => {
      expect(() => service.redirectToUrl('unknowncode')).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException with message "URL not found"', () => {
      expect(() => service.redirectToUrl('unknowncode')).toThrow(
        'URL not found',
      );
    });
  });
});
