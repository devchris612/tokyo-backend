import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SeedUsersDto } from './dto/seed-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('seed')
  seed() {
    return this.usersService.seed();
  }

  @UseGuards(AuthGuard)
  @Post('history')
  createHistory(@Request() req, @Body() createHistoryDto: CreateHistoryDto) {
    const id = req.user.sub;
    return this.usersService.createHistory(id, createHistoryDto);
  }

  @UseGuards(AuthGuard)
  @Post('forgot')
  sendForgotPasswordMail(
    @Request() req,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const id = req.user.sub;
    return this.usersService.sendForgotPasswordMail(
      id,
      forgotPasswordDto.email,
    );
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get('count')
  count() {
    return this.usersService.count();
  }

  @Get()
  findAll(@Query() query: { skip: number; limit: number }) {
    return this.usersService.findAll(query.skip, query.limit);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@Request() req) {
    return this.usersService.findMe(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('history')
  getHistory(@Request() req) {
    return this.usersService.getHistory(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('recommend')
  recommendSongs(@Request() req, @Query() query: { limit: number }) {
    return this.usersService.recommendSongs(req.user.sub, query.limit);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Delete('history/:id')
  removeHistory(@Param('id') id: string) {
    return this.usersService.removeHistory(id);
  }
}
