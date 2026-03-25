import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Invalid URL' })
  url: string;
}
