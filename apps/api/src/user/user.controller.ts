import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AddressService } from 'src/address/address.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService, private addressService: AddressService){}

    @Get(':id/addresses')
    async getUserAddresses(@Param('id') clerkId:string){
        try{
            return this.addressService.getAddressessByUserId(clerkId)
        } catch(error){
            if (error.code === 'P2025') {
                throw new NotFoundException('Usuário não encontrado')
              } else {
                throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
              }
        }
    }


}
