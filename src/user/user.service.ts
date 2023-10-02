import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUserById(id: number) {
    const { password, ...user } = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
