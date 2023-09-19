import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    dto.password = await argon.hash(dto.password);
    const user = await this.prisma.user.create({ data: dto });
    delete dto.password;
    return user;
  }
  sigin() {
    return { msg: 'I am signed in' };
  }
}
