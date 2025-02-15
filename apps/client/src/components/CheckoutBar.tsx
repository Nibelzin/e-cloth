import { FaShoppingCart } from "react-icons/fa";
import { FaCheck, FaCreditCard, FaTruck } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutBar = () => {

    const location = useLocation()

    const navigate = useNavigate()

    return (
        <div className={`flex fixed w-full mt-16 z-10 bg-white py-4 border-b justify-center items-center transition-transform duration-300`}>
            <div className="flex items-center">
                <div className="space-y-1 flex flex-col items-center relative mb-5 cursor-pointer" onClick={() => navigate("/cart")}>
                    <div className={`border p-2 rounded-full w-12 h-12 flex justify-center items-center ${location.pathname === "/cart" ? "bg-black border-black text-white" : "text-black"}`}>
                        {location.pathname.includes("delivery") || location.pathname.includes("checkout") ? (
                            <FaCheck />
                        ) : (
                            <FaShoppingCart size={20} />
                        )}
                    </div>
                    <p className={`text-sm absolute top-12 ${location.pathname === "/cart" && "font-semibold"}`}>Carrinho</p>
                </div>
                <hr className="w-16 mb-6" />
                <div className="space-y-1 flex flex-col items-center relative mb-5 cursor-pointer" onClick={() => navigate("/cart/delivery")}>
                    <div className={`border p-2 rounded-full w-12 h-12 flex justify-center items-center ${location.pathname === "/cart/delivery" ? "bg-black border-black text-white" : "text-black"}`}>
                        {location.pathname.includes("checkout") ? (
                            <FaCheck />
                        ) : (
                            <FaTruck size={20} />
                        )}
                    </div>
                    <p className={`text-sm absolute top-12 ${location.pathname === "/cart/delivery" && "font-semibold"}`}>Entrega</p>
                </div>
                <hr className="w-16 mb-6" />
                <div className="space-y-1 flex flex-col items-center relative mb-5">
                    <div className="border p-2 rounded-full w-12 h-12 flex justify-center items-center">
                        <FaCreditCard size={20} />
                    </div>
                    <p className="text-sm absolute top-12">Pagamento</p>
                </div>
            </div>
        </div>
    );
}

export default CheckoutBar;