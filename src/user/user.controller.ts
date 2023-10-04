import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private user: UserService) {}
  @Get('me')
  getMe(@GetUser('sub') userId: number) {
    return this.user.getUserById(userId);
  }
}
