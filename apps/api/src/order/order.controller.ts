import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

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

    @Put('/:orderId/confirm')
    async confirmOrder(@Param('orderId') orderId: string) {
        try {
            return this.orderService.confirmOrder(orderId)
        } catch(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':orderId/status')
    async updateOrderStatus(@Body() data: { status: OrderStatus }, @Param('orderId') orderId: string) {
        try {
            return this.orderService.updateOrderStatus(orderId, data.status)
        } catch(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':orderId')
    async getOrderById(@Param('orderId') orderId: string) {
        try {
            return this.orderService.getOrderById(orderId)
        } catch(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

}
