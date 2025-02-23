import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/productService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Home = () => {

    const { term } = useParams();

    const { isPending, data } = useQuery({
        queryKey: ['products', term],
        queryFn: () => getProducts({ term })
    })

    const availableProducts = data?.products.filter(product => product.productStock!.quantity > 0);

    return (
        <div className="px-4 md:px-16 lg:px-32 xl:px-44 py-16">
            {term ? (
                <>
                    <p className="font-semibold text-neutral-500 text-lg">Resultados para: {term}</p>
                    <h1 className="text-2xl font-bold mb-8">{availableProducts?.length} Produtos</h1>
                </>
            ) : (
                <h1 className="text-2xl font-bold mb-8">PRINCIPAIS PRODUTOS</h1>
            )}
            <div className="w-full flex justify-center">
                {isPending ? (
                    <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className={`bg-neutral-300 min-w-44 lg:w-72 h-96 cursor-pointer rounded-sm overflow-hidden flex flex-col animate-pulse`}></div>
                        ))}
                    </div>
                ) : (
                    <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                        {availableProducts?.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                )}
            </div>
        </div >
    );
}

export default Home;