import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddressService } from 'src/address/address.service';
import { OrderService } from 'src/order/order.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

  @Get()
  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/orders')
  async getUserOrders(@Param('id') clerkId: string, @Query('page') page: string, @Query('limit') limit: string) {
    try {
      return this.orderService.getOrdersByUserId(clerkId, page, limit);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get(':id/addresses')
  async getUserAddresses(@Param('id') clerkId: string) {
    try {
      return this.addressService.getAddressessByUserId(clerkId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Put(':id/phone')
  async alterUserPhoneNumber(@Param('id') clerkId: string, @Body() data: { phone: string }) {
    try {
      return this.userService.alterUserPhoneNumber({...data, clerkId});
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id/phone')
  async deleteUserPhoneNumber(@Param('id') clerkId: string) {
    try {
      return this.userService.deleteUserPhoneNumber(clerkId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
