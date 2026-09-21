import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/modules/user/dto/user.dto';
import { User } from 'src/guards/auth.guard';
import { LoggerService } from 'src/logger/logger.service';

@Controller('user')
export class UserController {
  constructor(
    private logger: LoggerService,
    private userService: UserService,
  ) {}
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @Get('profile')
  async getProfile(@User() user) {
    return this.userService.find({ id: user.id });
  }
}
