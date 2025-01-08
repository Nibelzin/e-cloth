import { RedirectToSignIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import CartItem from "../components/CartItem";
import { getFormattedPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/userService";
import { useEffect, useState } from "react";
import { Address } from "../types/types";

const Delivery = () => {

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

    const cartItems = useCartStore((state) => state.cart)
    const totalProductprice = cartItems.reduce((value, product) => product.promotionPrice && product.quantity === 1 ? value += product.promotionPrice : value += product.price * product.quantity
        , 0)

    const { user: clerkUser } = useUser()

    const { isPending, data: userData, error } = useQuery({
        queryKey: ["user", clerkUser?.id],
        queryFn: () => getUserById(clerkUser?.id!),
    })

    const mainUserAddress = userData?.addresses?.find(address => address.isDefault) || null

    useEffect(() => {
        if (mainUserAddress) {
            setSelectedAddress(mainUserAddress)
        }
    }, [mainUserAddress])

    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        )
    }

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">

            <div className="flex flex-col lg:flex-row gap-12 justify-end">
                <div className="w-full">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Entrega</h2>
                        <div className="border w-full p-4">
                            <p className="text-xl font-semibold mb-2">Endereço de Entrega:</p>
                            <div className="flex gap-2 items-center">
                                <p>
                                    {selectedAddress?.street}, {selectedAddress?.number} , {selectedAddress?.district} - {selectedAddress?.city}/{selectedAddress?.state}
                                </p>
                                {selectedAddress?.isDefault && (
                                    <div className="border px-2 py-1 rounded-full flex items-center justify-center">
                                        <p className="text-xs">Principal</p>
                                    </div>
                                )}
                            </div>
                            <button className="mt-4 text-blue-400 font-semibold">Alterar/Adicionar Endereço</button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Produtos</h2>
                        <div className="flex flex-col gap-4 flex-1">
                            {cartItems.map(product => (
                                <CartItem item={product} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border w-full lg:w-96 p-6 space-y-4 h-fit bg-white">
                    <div className="flex justify-between">
                        <p>Valor dos produtos:</p>
                        <p>{getFormattedPrice(totalProductprice)}</p>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <p className="font-semibold">Total:</p>
                        <p className="text-xl font-semibold">{getFormattedPrice(totalProductprice)}</p>
                    </div>
                    <button className="bg-black p-2 w-full rounded-full text-white">Continuar</button>
                </div>
            </div>
        </div>
    );
}

export default Delivery;