import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto, LoginDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      dto.password = await argon.hash(dto.password);
      const user = await this.prisma.user.create({ data: dto });
      delete dto.password;
      return user;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ForbiddenException('Credential taken');
      }
    }
  }
  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }
      const passwordMatch = await argon.verify(user.password, password);
      if (!passwordMatch) {
        throw new ForbiddenException('Credentials incorrect');
      }
      delete user.password;

      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
