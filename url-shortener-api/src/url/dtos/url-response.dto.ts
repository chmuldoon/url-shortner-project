import { IsString } from 'class-validator';

export class UrlResponseDto {
  @IsString()
  short_url: string;

  @IsString()
  long_url: string;
}
