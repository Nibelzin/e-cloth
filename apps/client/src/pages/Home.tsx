import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/types";
import { getProducts } from "../api/productService";
import { useSearchParams } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [numOfProducts, setNumOfProducts] = useState(0)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const result = await getProducts()
                setNumOfProducts(result.total)
                console.log(result)
                await setProducts(result.products)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div className="px-4 md:px-16 lg:px-32 xl:px-44 py-16">
            <h1 className="text-2xl font-bold mb-8">{numOfProducts} Produtos</h1>
            <div className="w-full flex justify-center">
                <div className="w-fit grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4 gap-y-3 gap-x-3">
                    {products.map(product => (
                            <ProductCard key={product.id} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;