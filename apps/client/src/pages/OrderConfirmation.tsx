import { useLocation } from "react-router-dom";
import { getOrderById } from "../api/orderService";
import { useQuery } from "@tanstack/react-query";
import { OrderItem } from "../types/types";
import { getFormattedPrice } from "../lib/utils";
import OrderStatusToChip from "../lib/utils/OrderStatusToChip";

const OrderConfirmation = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order");

    const { isPending, data } = useQuery({
        queryKey: ['order'],
        queryFn: () => getOrderById(orderId || "")
    })

    console.log(data)

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">
            <div className="flex flex-col lg:flex-row gap-12 justify-end">
                <div className="w-full">
                    <div className="w-full flex justify-center items-center flex-col">
                        <h2 className="text-4xl text-center font-semibold mb-10">Pedido realizado com sucesso!</h2>
                        <div className="w-80">
                            <img src="/succesful-purchase.svg" alt="Voltar" className=" w-full h-full select-none" />
                        </div>
                        <div className="w-full border p-4 mt-8 space-y-2">
                            <div className="flex flex-col lg:flex-row w-full gap-6 h-full">
                                <div className="w-full">
                                    <p className="font-semibold text-lg">Detalhes do Pedido</p>
                                    <div>
                                        <p className="font-semibold">Id do Pedido:</p>
                                        <p>{data?.id}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Método de Pagamento</p>
                                        <p>Cartão de Crédito</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-2">Itens do Pedido:</p>
                                        {data?.orderItems.map((orderItem: OrderItem) => (
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
                                <div className="border w-full lg:w-96 p-4 flex flex-col justify-between bg-white">
                                    <div>
                                        <p className="font-semibold text-lg mb-2">Pagamento:</p>
                                        <div className="flex justify-between mb-4">
                                        <p>Status:</p>
                                        <OrderStatusToChip status={data?.status} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <p>Valor dos produtos:</p>
                                            <p>{getFormattedPrice(data?.totalPrice)}</p>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Total:</p>
                                            <p className="text-xl font-semibold">{getFormattedPrice(data?.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default OrderConfirmation;