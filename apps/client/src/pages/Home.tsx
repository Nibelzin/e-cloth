import ProductCard from "../components/ProductCard";
import { productsMock } from "../lib/mock";

const Home = () => {
    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <h1 className="text-2xl font-bold mb-8">20 Produtos</h1>
            <div className="w-full flex justify-center">
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                    {productsMock.map(product => (
                        <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;