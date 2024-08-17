import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './schema/Song.schema';
import { Model } from 'mongoose';
import { SEEDING_SONGS } from './constants/seedSongs';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  create(createSongDto: CreateSongDto) {
    const newSong = new this.songModel(createSongDto);
    return newSong.save();
  }

  seed() {
    return this.songModel.insertMany(SEEDING_SONGS.songs);
  }

  findAll(skip: number = 0, limit: number = 0) {
    return this.songModel
      .find()
      .sort({ updatedAt: 'descending' })
      .skip(skip)
      .limit(limit);
  }

  findOne(id: string) {
    return this.songModel.findOne({ _id: id });
  }

  findNewestSongs() {
    return this.songModel.find().sort({ updatedAt: 'descending' }).limit(8);
  }

  findWithoutIds(ids: string[], limit: number) {
    return this.songModel
      .find({
        _id: {
          $nin: ids,
        },
      })
      .sort({ updatedAt: 'descending' })
      .limit(limit);
  }

  getPageCount() {
    return this.songModel.countDocuments();
  }

  searchSongsByName(name: string) {
    return this.songModel.find({
      title: { $regex: name, $options: 'i' },
    });
  }

  update(id: string, updateSongDto: UpdateSongDto) {
    return this.songModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateSongDto,
        updatedAt: new Date(),
      },
    );
  }

  remove(id: string) {
    return this.songModel.deleteOne({ _id: id });
  }

  removeAll() {
    return this.songModel.deleteMany({});
  }
}
