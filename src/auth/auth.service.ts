import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto, LoginDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      dto.password = await argon.hash(dto.password);
      const { password, ...user } = await this.prisma.user.create({
        data: dto,
      });

      return user;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ForbiddenException('Credential taken');
      }
    }
  }
  async login({ email, password }: LoginDto) {
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
    try {
      const access_token = await this.signToken({
        userId: user.id,
        email: user.email,
      });
      return { access_token };
    } catch (err) {
      throw new InternalServerErrorException('Error logging in');
    }
  }
  signToken({
    userId,
    email,
  }: {
    userId: number;
    email: string;
  }): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { expiresIn: '15m', secret });
  }
}
