import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {

    constructor(private prisma: PrismaService) { }

    async createOrder(data: OrderDTO) {
        return this.prisma.order.create({
            data: {
                user: {
                    connect: {
                        id: data.userId
                    }
                },
                orderDate: data.orderDate,
                status: data.status,
                totalPrice: data.totalPrice,
                paymentIntentId: data.paymentIntentId,
                shippingAddress: {
                    connect: {
                        id: data.shippingAddressId
                    }
                },
                orderItems: {
                    create: data.orderItems.map(item => {
                        return {
                            price: item.price,
                            quantity: item.quantity,
                            productId: item.productId,
                            sizeId: item.sizeId
                        }
                    })
                },
            }
        })
    }
}
