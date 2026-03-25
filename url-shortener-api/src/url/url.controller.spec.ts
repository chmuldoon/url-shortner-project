import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UrlData } from './interfaces/url-data.interface';

const mockUrlService = {
  shortenUrl: jest.fn(),
  getAllUrls: jest.fn(),
  redirectToUrl: jest.fn(),
};

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: jest.Mocked<UrlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get(UrlService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl() — POST /shorten', () => {
    it('should call urlService.shortenUrl with the URL from the request body', () => {
      const dto = { url: 'https://example.com' };
      urlService.shortenUrl.mockReturnValue({
        short_url: 'http://localhost:3000/abc123',
      });

      controller.shortenUrl(dto);

      expect(mockUrlService.shortenUrl).toHaveBeenCalledTimes(1);
      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(
        'https://example.com',
      );
    });

    it('should return the short_url object from the service', () => {
      const dto = { url: 'https://example.com' };
      const expected = { short_url: 'http://localhost:3000/abc123' };
      urlService.shortenUrl.mockReturnValue(expected);

      const result = controller.shortenUrl(dto);

      expect(result).toEqual(expected);
    });

    it('should propagate BadRequestException thrown by the service', () => {
      const dto = { url: 'not-a-url' };
      urlService.shortenUrl.mockImplementation(() => {
        throw new BadRequestException('Invalid URL');
      });

      expect(() => controller.shortenUrl(dto)).toThrow(BadRequestException);
      expect(() => controller.shortenUrl(dto)).toThrow('Invalid URL');
    });
  });

  describe('getAllUrls() — GET /urls', () => {
    it('should call urlService.getAllUrls once', () => {
      urlService.getAllUrls.mockReturnValue([]);

      controller.getAllUrls();

      expect(mockUrlService.getAllUrls).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no URLs exist', () => {
      urlService.getAllUrls.mockReturnValue([]);

      const result = controller.getAllUrls();

      expect(result).toEqual([]);
    });

    it('should return the list of UrlData from the service', () => {
      const mockUrls: UrlData[] = [
        {
          id: 123n,
          short_url: 'http://localhost:3000/abc123',
          long_url: 'https://example.com',
          created_at: new Date('2026-01-01'),
          redirect_count: 3,
        },
        {
          id: 456n,
          short_url: 'http://localhost:3000/xyz789',
          long_url: 'https://google.com',
          created_at: new Date('2026-01-02'),
          redirect_count: 0,
        },
      ];
      urlService.getAllUrls.mockReturnValue(mockUrls);

      const result = controller.getAllUrls();

      expect(result).toEqual(mockUrls);
      expect(result).toHaveLength(2);
    });
  });

  describe('redirectToUrl() — GET /:shortUrl', () => {
    it('should call urlService.redirectToUrl with the shortUrl param', () => {
      urlService.redirectToUrl.mockReturnValue('https://example.com');

      controller.redirectToUrl('abc123');

      expect(mockUrlService.redirectToUrl).toHaveBeenCalledTimes(1);
      expect(mockUrlService.redirectToUrl).toHaveBeenCalledWith('abc123');
    });

    it('should return an object with the resolved url and statusCode 302', () => {
      urlService.redirectToUrl.mockReturnValue('https://example.com');

      const result = controller.redirectToUrl('abc123');

      expect(result).toEqual({
        url: 'https://example.com',
        statusCode: 302,
      });
    });

    it('should propagate NotFoundException thrown by the service', () => {
      urlService.redirectToUrl.mockImplementation(() => {
        throw new NotFoundException('URL not found');
      });

      expect(() => controller.redirectToUrl('unknowncode')).toThrow(
        NotFoundException,
      );
      expect(() => controller.redirectToUrl('unknowncode')).toThrow(
        'URL not found',
      );
    });
  });
});
