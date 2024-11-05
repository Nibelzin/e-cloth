import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO, UserPhoneDTO } from './dto/user.dto';
import { ClerkUserEventData } from './dto/clerk-user-event-data.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ id: id }, { clerkId: id }] },
      include: {
        addresses: true
      }
    });

  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserDTO> {
    const userExists = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (userExists) {
      return this.updateUser({
        where: { email: data.email },
        data,
      });
    }

    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserDTO> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }

  async alterUserPhoneNumber(data: UserPhoneDTO) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId: data.clerkId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.phone === data.phone) return;

    return this.prisma.user.update({
      where: { id: user.id },
      data: { phone: data.phone },
    });
  }

  async deleteUserPhoneNumber(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: { phone: null },
    });
  }

  clerkDataToUserDTO(clerkData: ClerkUserEventData): UserDTO | null {
    if (
      !clerkData.id ||
      !clerkData.email_addresses ||
      clerkData.email_addresses.length === 0 ||
      !clerkData.first_name
    ) {
      return null;
    }

    const user: UserDTO = {
      clerkId: clerkData.id,
      email: clerkData.email_addresses[0]?.email_address,
      firstName: clerkData.first_name,
      lastname: clerkData.last_name,
    };

    return user;
  }
}
