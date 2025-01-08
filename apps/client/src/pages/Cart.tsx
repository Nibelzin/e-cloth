import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { getFormattedPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";

const Cart = () => {

    const cartItems = useCartStore((state) => state.cart)

    const totalProductprice = cartItems.reduce((value, product) => product.promotionPrice && product.quantity === 1 ? value += product.promotionPrice : value += product.price * product.quantity
        , 0)

    const navigate = useNavigate()


    if (cartItems.length === 0) return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16 h-full">
            <div className="w-full h-full flex flex-col space-y-6 justify-center items-center">
                <div className="w-80">
                    <img src="empty-cart.svg" alt="Voltar" className=" w-full h-full select-none" />
                </div>
                <div>
                    <p className="text-center text-2xl font-bold">Seu carrinho está vazio...</p>
                    <p>Adicione produtos para continuar sua compra</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">
            <div className="flex flex-col lg:flex-row gap-12 justify-end">
                <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-4">Carrinho</h2>
                    <div className="flex flex-col gap-4 flex-1">
                        {cartItems.map(product => (
                            <CartItem item={product} />
                        ))}
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
                    <button className="bg-black p-2 w-full rounded-full text-white" onClick={() => navigate("/cart/delivery")}>Continuar</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;