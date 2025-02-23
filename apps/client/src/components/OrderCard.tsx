import { getFormattedPrice } from "../lib/utils";
import OrderStatusToChip from "../lib/utils/OrderStatusToChip";
import { Order, OrderItem } from "../types/types";
import { format } from "date-fns";

interface OrderCardProps {
    order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <div className={`w-full border p-4 space-y-2`}>
            <div className="flex flex-col lg:flex-row w-full gap-6 h-full">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row justify-between items-start">
                        <div>
                            <div className="flex gap-2">
                                <p className="font-semibold">Id do Pedido:</p>
                                <p>{order.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <p className="font-semibold">Realizado em:</p>
                                <p>{format(order.orderDate, "dd/MM/yyyy HH:mm")}</p>
                            </div>
                        </div>
                        <a href={`/my-orders/${order.id}`} className="text-blue-500 mb-4">Mais detalhes</a>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Itens do Pedido:</p>
                        <div className="space-y-4">
                            {order?.orderItems.map((orderItem: OrderItem) => (
                                <div className="border p-2">
                                    <div className="flex gap-2">
                                        <div className="w-16 h-16">
                                            <img src={orderItem.product?.productImages[0].url} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <p>{orderItem.product?.name}</p>
                                            <p>Qtd: {orderItem.quantity}</p>
                                            <p>Tamanho: {orderItem.size?.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:border-l w-full lg:w-96 px-4 flex flex-col justify-between bg-white">
                    <div>
                        <div className="flex justify-between mb-4">
                            <p>Status do Pedido:</p>
                            <OrderStatusToChip status={order?.status} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p>Valor dos produtos:</p>
                            <p>{getFormattedPrice(order?.totalPrice)}</p>
                        </div>
                        {order.discount && (
                            <div className="flex justify-between">
                                <p>Desconto:</p>
                                <p>-{getFormattedPrice(order.discount)}</p>
                            </div>
                        )}
                        <hr />
                        <div className="flex justify-between">
                            <p className="font-semibold">Total:</p>
                            <p className="text-xl font-semibold">{getFormattedPrice(order.discount ? order.totalPrice - order.discount : order.totalPrice)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderCard;