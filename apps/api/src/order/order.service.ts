import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDTO } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {

    constructor(private prisma: PrismaService) { }

    async getOrdersByUserId(clerkId: string, page: string, limit: string) {

        const user = await this.prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }


        const orders = await this.prisma.order.findMany({
            where: {
                userId: user.id
            },
            take: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                productImages: true
                            }
                        },
                        size: true
                    }
                },
                shippingAddress: true
            }
        })

        const total = await this.prisma.order.count({
            where: {
                userId: user.id
            }
        })

        return {
            orders,
            total
        }
    }

    async getOrderById(orderId: string) {
        return this.prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                productImages: true
                            }
                        },
                        size: true
                    }
                },
                shippingAddress: true
            }
        })
    }

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

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        return this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: status
            }
        })
    }
}
