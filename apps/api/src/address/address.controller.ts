import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

@Controller('address')
export class AddressController {


    @Get('cep/:cep')
    async getCep(@Param('cep') cep: string){
        try{
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json();
            return data
        } catch(e) {
            throw new NotFoundException('CEP não encontrado')
        }
    }
}
