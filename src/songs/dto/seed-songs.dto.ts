import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSongDto } from './create-song.dto';

export class SeedSongsDto {
  @IsNotEmpty()
  songs: CreateSongDto[];
}
