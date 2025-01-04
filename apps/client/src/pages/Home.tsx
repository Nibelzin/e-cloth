import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productService";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
    const [searchParams] = useSearchParams()

    const { isPending, data } = useQuery({
        queryKey: ['products', searchParams.toString()],
        queryFn: () => getProducts()
    })

    return (
        <div className="px-4 md:px-16 lg:px-32 xl:px-44 py-16">
            <h1 className="text-2xl font-bold mb-8">{data?.total} Produtos</h1>
            <div className="w-full flex justify-center">
                {isPending ? (
                    <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className={`bg-neutral-300 w-52 lg:w-72 h-96 cursor-pointer rounded-sm overflow-hidden flex flex-col animate-pulse`}></div>
                        ))}
                    </div>
                ) : (
                    <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                        {data?.products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                )}
            </div>
        </div >
    );
}

export default Home;