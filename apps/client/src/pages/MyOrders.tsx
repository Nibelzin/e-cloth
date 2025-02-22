import { RedirectToSignIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../api/userService";
import OrderCard from "../components/OrderCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { usePagination } from "../hooks/usePagination";

const MyOrders = () => {
    const { isSignedIn, user } = useUser();

    if (!isSignedIn) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        )
    }

    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");
    const limit = queryParams.get("limit");

    const { isPending, data } = useQuery({
        queryKey: ['my-orders', user.id, page, limit],
        queryFn: () => getUserOrders(user.id ?? "", page ?? "1", limit ?? "5"),
    })

    const { currPage, numberOfPages, handlePageChange } = usePagination(data?.total ?? 0, parseInt(limit ?? "5"));

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 mt-20">
            <div>
                <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>
            </div>
            <div>
                {
                    isPending ? (
                        <div className="flex flex-col space-y-8">
                            {
                                Array.from({ length: 3 }, (_, index) => (
                                    <div key={index} className="w-full bg-neutral-300 h-48 animate-pulse"></div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-8">
                            {data?.orders.map(order => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    )
                }
            </div>
            <div className="flex justify-center gap-2 mt-8">
                <button className="border w-12 h-12 flex justify-center items-center cursor-pointer"
                    onClick={() => handlePageChange(currPage - 1)}>
                    <FaChevronLeft />
                </button>
                {
                    isPending ? (
                        <>
                            {
                                Array.from({ length: 2 }, (_, index) => (
                                    <button key={index} className={`w-12 h-12 flex justify-center items-center cursor-pointer font-semibold bg-neutral-300 animate-pulse`}>
                                    </button>
                                ))
                            }
                        </>
                    ) :
                        (
                            <>
                                {
                                    Array.from({ length: numberOfPages }, (_, index) => (
                                        <button key={index} className={`border w-12 h-12 flex justify-center items-center cursor-pointer font-semibold ${currPage === index + 1 ? "bg-neutral-100" : ""}`} onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    ))
                                }
                            </>
                        )
                }
                <button className="border w-12 h-12 flex justify-center items-center cursor-pointer"
                    onClick={() => handlePageChange(currPage + 1)}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}

export default MyOrders;