import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/orderService";
import { useUser } from "@clerk/clerk-react";
import { getUserById } from "../api/userService";
import { format } from "date-fns";
import { FaRegCreditCard } from "react-icons/fa6";
import OrderStatusToChip from "../lib/utils/OrderStatusToChip";
import { getFormattedPrice } from "../lib/utils";
import { OrderItem } from "../types/types";

const OrderDetails = () => {

    const { isSignedIn, user: clerkUser } = useUser();
    const { id: orderId } = useParams()

    const { isPending: isOrderDataPending, data: order } = useQuery({
        queryKey: ['order'],
        queryFn: () => getOrderById(orderId || "")
    })

    const { isPending: isUserDataPending, data: userData, error } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserById(clerkUser?.id!),
    })

    const isUserOrder: boolean = userData?.id === order?.userId


    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">
            {
                isUserDataPending || isOrderDataPending ? (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Detalhes do Pedido</h1>
                        <div className="flex flex-col space-y-4">
                            <div className="w-full bg-neutral-300 h-20 animate-pulse"></div>
                            <div className="w-full bg-neutral-300 h-28 animate-pulse"></div>
                            <div className="w-full bg-neutral-300 h-28 animate-pulse"></div>
                        </div>
                    </>
                ) : (
                    isUserOrder ? (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
                                <p>Id do pedido: {order?.id}</p>
                                <p>Realizado em: {format(order!.orderDate, "dd/MM/yyyy, 'as' HH:mm")}</p>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-2 mb-8">
                                <div className="lg:border-r p-2 w-full">
                                    <h2 className="font-semibold mb-4">Endereço de Entrega</h2>
                                    <p className="uppercase">{order?.shippingAddress?.street}, {order?.shippingAddress?.number}</p>
                                    <p className="upppercase">CEP {order?.shippingAddress?.postalCode}</p>
                                    <p className="uppercase">{order?.shippingAddress?.district}, {order?.shippingAddress?.city} - {order?.shippingAddress?.state}</p>
                                </div>
                                <hr className="my-8 lg:hidden" />
                                <div className="lg:border-r p-2 w-full">
                                    <h2 className="font-semibold mb-4">Pagamento</h2>
                                    <div className="flex items-center gap-2">
                                        <FaRegCreditCard />
                                        <p>Cartão de Crédito</p>
                                    </div>
                                </div>
                                <hr className="my-8 lg:hidden" />
                                <div className="w-full px-2 flex flex-col justify-between bg-white">
                                    <h2 className="font-semibold mb-4">Valor Total</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <p>Valor dos produtos:</p>
                                            <p>{getFormattedPrice(order?.totalPrice)}</p>
                                        </div>
                                        {order?.discount && (
                                            <div className="flex justify-between">
                                                <p>Desconto:</p>
                                                <p>-{getFormattedPrice(order.discount)}</p>
                                            </div>
                                        )}
                                        <hr />
                                        <div className="flex justify-between">
                                            <p className="font-semibold">Total:</p>
                                            <p className="text-xl font-semibold">{getFormattedPrice(order?.discount ? order.totalPrice - order.discount : order?.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-8 lg:hidden" />
                            <div className="px-2">
                                <p className="font-semibold mb-2">Itens do Pedido:</p>
                                <div className="space-y-4">
                                    {order?.orderItems.map((orderItem: OrderItem) => (
                                        <div className="border p-2">
                                            <div className="flex gap-2">
                                                <div className="w-28 h-28 bg-gray-300">
                                                    <img src={orderItem.product?.productImages[0].url} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex w-full justify-between p-2">
                                                    <div>
                                                        <p>{orderItem.product?.name}</p>
                                                        <p>Qtd: {orderItem.quantity}</p>
                                                        <p>Tamanho: {orderItem.size?.size}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Valor Unitário</p>
                                                        <p className="text-lg text-end">{getFormattedPrice(orderItem.price)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col space-y-6 justify-center items-center">
                            <div className="w-80">
                                <img src="/not-found.svg" alt="Voltar" className=" w-full h-full select-none" />
                            </div>
                            <div>
                                <p>{order ? "Você não tem permissão para acessar detalhes desse pedido" : "Pedido não encontrado"}</p>
                            </div>
                        </div>
                    )
                )
            }
        </div>
    );
}

export default OrderDetails;