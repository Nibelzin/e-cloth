import { RedirectToSignIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import CartItem from "../components/CartItem";
import { getFormattedPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "../api/userService";
import { useEffect, useState } from "react";
import { Address } from "../types/types";
import Dialog from "../components/Dialog";
import AddressForm from "../components/AddressForm";

const Delivery = () => {

    const [openAddressDialog, setOpenAddressDialog] = useState(false)
    const [addAddressMode, setAddAddressMode] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

    const cartItems = useCartStore((state) => state.cart)
    const totalProductprice = cartItems.reduce((value, product) => product.promotionPrice && product.quantity === 1 ? value += product.promotionPrice : value += product.price * product.quantity
        , 0)

    const { user: clerkUser } = useUser()
    const queryClient = useQueryClient()

    const { isPending, data: userData, error } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserById(clerkUser?.id!),
    })

    const mainUserAddress = userData?.addresses?.find(address => address.isDefault) || null

    const handleAddressModeClose = () => {
        setAddAddressMode(false)
        queryClient.invalidateQueries({ queryKey: ["user"] })
    }

    useEffect(() => {
        if (mainUserAddress) {
            setSelectedAddress(mainUserAddress)
        } else {
            setSelectedAddress(null)
        }
    }, [mainUserAddress])

    useEffect(() => {
        setAddAddressMode(false)
    }, [openAddressDialog])

    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        )
    }

    return (
        <>
            <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">

                <div className="flex flex-col lg:flex-row gap-12 justify-end">
                    <div className="w-full">
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold mb-4">Entrega</h2>
                            <div className="border w-full p-4">
                                <p className="text-xl font-semibold mb-2">Endereço de Entrega:</p>
                                {selectedAddress && (
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
                                )}
                                <button className={`${selectedAddress ? "mt-4" : "mt-2"} text-blue-400 font-semibold`} onClick={() => setOpenAddressDialog(true)}>Alterar/Adicionar Endereço</button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Produtos</h2>
                            <div className="flex flex-col gap-4 flex-1">
                                {cartItems.map(product => (
                                    <CartItem item={product} showMode />
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
            <Dialog
                open={openAddressDialog}
                closeDialog={() => setOpenAddressDialog(false)}
                className="w-[48rem]"
            >
                <Dialog.Title>{addAddressMode ? "Adicionar Endereço" : "Selecionar Endereço"}</Dialog.Title>
                <Dialog.Body>
                    {addAddressMode ?
                        (
                            <AddressForm closeForm={() => handleAddressModeClose()} noLabel />
                        )
                        :
                        (
                            <>
                                <select className="border p-2 w-full rounded-sm"
                                    value={selectedAddress?.id}
                                    onChange={e => setSelectedAddress(userData?.addresses?.find(address => address.id === e.target.value) || null)}
                                >
                                    <option value="" disabled selected={!selectedAddress}>Selecione um endereço</option>
                                    {userData?.addresses?.map(address => (
                                        <option key={address.id} value={address.id}>{address.street}, {address.number} , {address.district} - {address.city}/{address.state}</option>
                                    ))}
                                </select>
                                <button className="mt-4 text-blue-400 font-semibold" onClick={() => setAddAddressMode(true)}>Adicionar Endereço</button>
                            </>
                        )}
                </Dialog.Body>
            </Dialog>
        </>
    );
}

export default Delivery;