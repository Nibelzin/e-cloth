import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [PrismaModule],
  exports: [AddressService]
})
export class AddressModule {}
