import { RedirectToSignIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { getFormattedPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "../api/userService";
import { useEffect, useRef, useState } from "react";
import { Address } from "../types/types";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAddressStore } from "../store/addressStore";
import ReactLoading from "react-loading";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY

if (!STRIPE_PUBLIC_KEY) {
    throw new Error('Missing Stripe Key')
}

const stripe = loadStripe(STRIPE_PUBLIC_KEY)

const Checkout = () => {

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const cartItems = useCartStore((state) => state.cart)
    const totalProductprice = cartItems.reduce((value, product) => {
        if (product.promotionPrice && product.quantity === 1) {
            return value + (product.promotionPrice * product.quantity);
        } else {
            return value + (product.price * product.quantity);
        }
    }, 0);

    const { user: clerkUser } = useUser()
    const queryClient = useQueryClient()
    const addressStore = useAddressStore()

    const formRef = useRef<HTMLFormElement>(null)

    const { isPending, data: userData, error } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserById(clerkUser?.id!),
    })

    const handlePayButtonClick = async () => {
        if (!formRef.current) return

        formRef.current.requestSubmit()
    }

    useEffect(() => {
        if (addressStore.selectedAddress) {
            setSelectedAddress(addressStore.selectedAddress)
        } else {
            setSelectedAddress(null)
        }
    }, [])

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
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">Pagamento</h2>
                        <div className="flex flex-col gap-4 flex-1">
                            <Elements stripe={stripe} options={{
                                mode: 'payment',
                                amount: Math.floor(totalProductprice * 100),
                                currency: 'brl',
                            }}>
                                <CheckoutForm
                                    totalProductPrice={totalProductprice}
                                    products={cartItems}
                                    userData={userData}
                                    amount={Math.floor(totalProductprice * 100)}
                                    formRef={formRef}
                                    loading={loading}
                                    setLoading={setLoading}
                                    userAddress={selectedAddress}
                                />
                            </Elements>
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
                    <button className="bg-black p-2 w-full flex justify-center rounded-full text-white" onClick={() => handlePayButtonClick()}>{loading === true ? <ReactLoading type="spin" width={15} height={15} /> : "Pagar"}</button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;