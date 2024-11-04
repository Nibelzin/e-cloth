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
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddressService } from 'src/address/address.service';
import { UserPhoneDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
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

  @Put('phone')
  async alterUserPhoneNumber(@Body() data: UserPhoneDTO) {
    try {
      return this.userService.alterUserPhoneNumber(data);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete('phone')
  async deleteUserPhoneNumber(@Body() data: UserPhoneDTO) {
    try {
      return this.userService.deleteUserPhoneNumber(data);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
