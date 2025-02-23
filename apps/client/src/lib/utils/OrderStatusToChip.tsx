import { OrderStatus } from "../../types/types";

interface OrderStatusToChipProps {
    status?: OrderStatus
}

const OrderStatusToChip = ({ status }: OrderStatusToChipProps) => {
    switch (status) {
        case OrderStatus.PENDING:
            return (
                <div className="bg-yellow-500 text-white px-2 rounded-full">
                    Pendente
                </div>
            )
        case OrderStatus.CONFIRMED:
            return (
                <div className="bg-green-500 text-white px-2 rounded-full">
                    Confirmado
                </div>
            )
        case OrderStatus.CANCELED:
            return (
                <div className="bg-gray-500 text-white px-2 rounded-full">
                    Cancelado
                </div>
            )
    }
}
 
export default OrderStatusToChip;status: OrderStatus