import CartItem from "../components/CartItem";
import { useCartStore } from "../store/cartStore";

const Cart = () => {

    const cartItems = useCartStore((state) => state.cart)

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <h2 className="text-2xl font-semibold mb-4">Carrinho</h2>
            <div className="flex flex-col lg:flex-row gap-12 justify-end">
                <div className="flex flex-col gap-4 flex-1">
                    {cartItems.map(product => (
                        <CartItem item={product}/>
                    ))}
                </div>
                <div className="border w-full lg:w-96 p-6 space-y-4 h-fit">
                    <div className="flex justify-between">
                        <p>Valor dos produtos:</p>
                        <p>R$ 1200,00</p>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <p>Frete:</p>
                        <p>Calculando</p>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <p className="font-semibold">Total:</p>
                        <p className="text-xl font-semibold">R$ 120,00</p>
                    </div>
                    <button className="bg-black p-2 w-full rounded-full text-white">Continuar</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;