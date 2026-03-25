import { IsString } from 'class-validator';

export class UrlResponseDto {
  @IsString()
  short_url: string;
}
