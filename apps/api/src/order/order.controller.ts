import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async createOrder(@Body() data: OrderDTO) {
        try {
            return this.orderService.createOrder(data)
        } catch(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

}
