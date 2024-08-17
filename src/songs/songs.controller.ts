import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Post('seed')
  seed() {
    return this.songsService.seed();
  }

  @Get()
  findAll(@Query() query: { skip: number; limit: number }) {
    return this.songsService.findAll(query.skip, query.limit);
  }

  @Get('new')
  findNewestSongs() {
    return this.songsService.findNewestSongs();
  }

  @Get('count')
  getPageCount() {
    return this.songsService.getPageCount();
  }

  @Get('search')
  searchSongs(@Query() query: { name: string }) {
    return this.songsService.searchSongsByName(query.name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }

  @Delete('')
  removeAll() {
    return this.songsService.removeAll();
  }
}
