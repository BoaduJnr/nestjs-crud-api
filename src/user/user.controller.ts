import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private user: UserService) {}
  @Get('me')
  getMe(@Req() req: Request) {
    const { sub } = req.user as { sub: number };
    return this.user.getUserById(sub);
  }
}
