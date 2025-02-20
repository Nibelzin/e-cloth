import { RedirectToSignIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/userService";
import OrderStatusToChip from "../lib/utils/OrderStatusToChip";
import OrderCard from "../components/OrderCard";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const MyOrders = () => {
    const { isSignedIn, user } = useUser();

    if (!isSignedIn) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        )
    }

    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");
    const limit = queryParams.get("limit");

    const { isPending, data } = useQuery({
        queryKey: ['my-orders', user.id, page, limit],
        queryFn: () => getUserOrders(user.id ?? "", page ?? "1", limit ?? "5"),
    })

    const currPage = parseInt(page ?? "1")
    const numberOfPages = Math.ceil(data?.total! / parseInt(limit ?? "5"))

    const handlePageChange = (page: number) => {
        if (page < 1 || page > numberOfPages) return;
        if (page === 1) {
            queryParams.delete("page")
        } else {
            queryParams.set("page", String(page))
        }
        navigate({
            search: queryParams.toString()
        })
    }


    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">
            <div>
                <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>
            </div>
            <div>
                {data?.orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
                <div className="border w-12 h-12 flex justify-center items-center cursor-pointer"
                    onClick={() => handlePageChange(currPage - 1)}>
                    <FaChevronLeft />
                </div>
                {Array.from({ length: numberOfPages }, (_, index) => (
                    <div key={index} className={`border w-12 h-12 flex justify-center items-center cursor-pointer ${currPage === index + 1 ? "bg-neutral-100" : ""}`}>
                        {index + 1}
                    </div>
                ))}
                <div className="border w-12 h-12 flex justify-center items-center cursor-pointer"
                    onClick={() => handlePageChange(currPage + 1)}
                >
                    <FaChevronRight />
                </div>
            </div>
        </div>
    );
}

export default MyOrders;