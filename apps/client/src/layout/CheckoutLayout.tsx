import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useCartStore } from "../store/cartStore"

function CheckoutLayout() {

    const cartItems = useCartStore((state) => state.cart)

    return (
        <>
            <Header checkout={cartItems.length > 0}/>
            <div className="py-32 flex-1">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default CheckoutLayout
