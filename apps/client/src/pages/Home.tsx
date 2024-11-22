import ProductCard from "../components/ProductCard";
import { productsMock } from "../lib/mock";

const Home = () => {
    return (
        <div className="px-4 md:px-16 lg:px-32 xl:px-44 py-16">
            <h1 className="text-2xl font-bold mb-8">20 Produtos</h1>
            <div className="w-full flex justify-center">
                <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                    {productsMock.map(product => (
                            <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;