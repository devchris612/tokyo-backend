import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  songUrl: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
