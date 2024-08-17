import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/User.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/auth/utils/password';
import { CreateHistoryDto } from './dto/create-history.dto';
import { SongsService } from 'src/songs/songs.service';
import { MailerService } from '@nestjs-modules/mailer';
import { getRandomArbitrary } from './utils/math';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SeedUsersDto } from './dto/seed-users.dto';
import { SEED_USERS } from './constants/seedUsers';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private songsService: SongsService,
    private readonly mailService: MailerService,
  ) {}

  async seed() {
    const { users } = SEED_USERS;

    const usersWithHashedPassword = await Promise.all(
      users.map(async (user) => {
        const { password, ...rest } = user;
        return {
          ...rest,
          hashedPassword: await hashPassword(password),
          songs: [],
        };
      }),
    );

    return this.userModel.insertMany(usersWithHashedPassword);
  }

  async sendForgotPasswordMail(id: string, email: string) {
    try {
      const tempPassword = String(getRandomArbitrary(100000, 200000));

      await this.changePassword(id, tempPassword);

      const message = `Forgot your password? Please use this new password to login: ${tempPassword}. Make sure that you change your password after that.`;

      await this.mailService.sendMail({
        from: 'mailtrap@demomailtrap.com',
        to: email,
        subject: `Music Market: Reset your password`,
        text: message,
      });
      return 'Success';
    } catch (error) {
      throw new HttpException(
        'Please configure your own SMTP on Mailtrap to send mails',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async recommendSongs(id: string, limit: number) {
    const user = await this.userModel.findById(id).populate('songs');
    const favouriteSongs = user.songs;
    favouriteSongs.reverse();
    const songs = await this.songsService.findWithoutIds(
      favouriteSongs.map((song: any) => song._id.toString()),
      favouriteSongs.length ? limit - favouriteSongs.length : limit,
    );
    return [...favouriteSongs, ...songs];
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      hashedPassword: hashedPassword,
    });
    return newUser.save();
  }

  async createHistory(id: string, createHistoryDto: CreateHistoryDto) {
    try {
      const foundUser = await this.userModel.findById(id).populate('songs');

      if (!foundUser) {
        throw new HttpException('User not exist', HttpStatus.BAD_REQUEST);
      }

      const { songId } = createHistoryDto;

      const favouriteSongs = foundUser.songs;

      const isExistSongReference = favouriteSongs.find((song: any) => {
        return song._id.toString() === songId;
      })
        ? true
        : false;

      if (isExistSongReference) {
        throw new HttpException(
          'This song already exists in history',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (Array.isArray(favouriteSongs) && favouriteSongs?.length === 3) {
        favouriteSongs.shift();
      }
      const foundSong = await this.songsService.findOne(songId);

      if (!foundSong) {
        throw new HttpException('Song not found', HttpStatus.BAD_REQUEST);
      }

      favouriteSongs.push(foundSong);
      await foundUser.save();

      return foundSong;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll(skip: number = 0, limit: number = 0) {
    return this.userModel
      .find()
      .sort({ name: 'descending' })
      .skip(skip)
      .limit(limit);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  findMe(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  count() {
    return this.userModel.countDocuments();
  }

  async getHistory(id: string) {
    const history = await this.userModel
      .findOne({ _id: id })
      .populate('songs')
      .select({ songs: 1 });
    history.songs.reverse();
    return history;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = await hashPassword(updateUserDto.password);
    return this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        hashedPassword: hashedPassword,
        updatedAt: new Date(),
      },
    );
  }

  async changePassword(id: string, newPassword: string) {
    const hashedPassword = await hashPassword(newPassword);
    return this.userModel.findByIdAndUpdate(id, {
      hashedPassword: hashedPassword,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, old_password, new_password, cf_new_password } =
      resetPasswordDto;
    if (old_password === new_password) {
      throw new HttpException(
        'Old and new passwords must be different',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new_password !== cf_new_password) {
      throw new HttpException('New passwords mismatch', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.findOneByEmail(email);

    if (!foundUser) {
      throw new HttpException(
        'Incorrect email. User not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isCorrectOldPassword = await comparePassword(
      foundUser.hashedPassword,
      old_password,
    );

    if (!isCorrectOldPassword) {
      throw new HttpException(
        'Old password is incorrect.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.changePassword(foundUser._id.toString(), new_password);
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }

  removeHistory(id: string) {
    return this.userModel.findByIdAndUpdate(id, {
      songs: [],
    });
  }
}
