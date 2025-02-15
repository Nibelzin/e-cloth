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
        case OrderStatus.COMPLETED:
            return (
                <div className="bg-green-500 text-white px-2 rounded-full">
                    Confirmado
                </div>
            )
    }
}
 
export default OrderStatusToChip;status: OrderStatus