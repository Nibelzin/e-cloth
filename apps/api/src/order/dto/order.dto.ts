import { Address, OrderStatus } from "@prisma/client"
import { OrderItemDTO } from "./order.item.dto"

export class OrderDTO {
    id?: string
    userId: string
    orderDate: Date
    status: OrderStatus
    totalPrice: number
    paymentIntentId: string
    shippingAddressId: string
    orderItems: OrderItemDTO[]
}


