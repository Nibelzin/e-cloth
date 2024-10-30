import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDTO, CreateAddressDTO } from './dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('cep/:cep')
  async getCep(@Param('cep') cep: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      return data;
    } catch (e) {
      throw new NotFoundException('CEP não encontrado');
    }
  }

  @Get()
  async getAddresses() {
    try {
      return await this.addressService.getAddressess();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getAddressById(@Param('id') id: string) {
    try {
      return await this.addressService.getAddressById(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Endereço não encontrado')
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post()
  async createAddress(@Body() data: CreateAddressDTO) {
    try {
      return await this.addressService.createAddress(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateAddress(@Body() data: AddressDTO) {
    try {
      return await this.addressService.updateAddress(data);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Endereço para alteração não encontrado')
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string) {
    try {
      return await this.addressService.deleteAddress(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Endereço para deleção não encontrado')
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
