import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productsMock } from "../lib/mock";
import { getFormettedPrice } from "../lib/utils";


const ProductDetail = () => {
    const { id: productId } = useParams();

    const product = productsMock.find(product => product.id === productId)


    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <div className="flex flex-col lg:flex-row gap-4 mb-32">
                <div className="w-full lg:w-3/5 overflow-hidden border">
                    <img src={product?.imgs[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="mb-4">
                            <p className="text-neutral-700">{product?.category.name}</p>
                            <h1 className="uppercase text-2xl font-semibold mb-4">{product?.name}</h1>
                            <p>{product?.description}</p>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            {product?.promotionPrice ? (
                                <>
                                    <p className="text-2xl font-bold">{getFormettedPrice(product?.promotionPrice)}</p>
                                    <p className="line-through">{getFormettedPrice(product?.price)}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold">{getFormettedPrice(product?.price)}</p>
                            )}
                        </div>
                    </div>
                    <button className="bg-black p-4 rounded-full text-white">Adicionar ao carrinho</button>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Você Também pode gostar</h2>
                <div className="flex overflow-x-auto gap-4">
                    {productsMock.map(product => (
                        <ProductCard product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;