import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AddressModule } from 'src/address/address.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule, AddressModule, OrderModule]
})
export class UserModule {}
