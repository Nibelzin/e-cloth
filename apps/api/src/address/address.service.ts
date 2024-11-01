import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { AddressDTO, CreateAddressDTO } from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async getAddressess() {
    return this.prisma.address.findMany();
  }

  async getAddressessByUserId(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: 'desc' },
    });
  }

  async getAddressById(id: string) {
    return this.prisma.address.findUniqueOrThrow({
      where: { id },
    });
  }

  async createAddress(data: CreateAddressDTO) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId: data.clerkId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.address.create({
      data: {
        city: data.city,
        district: data.district,
        number: data.number,
        postalCode: data.postalCode,
        state: data.state,
        street: data.street,
        complement: data.complement,
        userId: user.id,
      },
    });
  }

  async updateAddress(data: AddressDTO) {
    return this.prisma.address.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteAddress(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async setAddressAsUserDefault(id: string) {

    const address = await this.getAddressById(id)

    return await this.prisma.$transaction(async (prisma) => {
        await prisma.address.updateMany({
            where: { NOT: { id }, userId: address.userId },
            data: { isDefault: false },
        });

        return prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });
    });
  }
}
