import { Link } from "react-router-dom";
import { getFormettedPrice } from "../lib/utils";
import { Product } from "../types/interfaces";

interface ProductCardProps {
    product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white min-w-48 max-w-72 border drop-shadow cursor-pointer">
                <div className="w-full h-44">
                    <img src={product.imgs[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                    <div className="">
                        <h1 className="text-lg uppercase truncate" title={product.name}>{product.name}</h1>
                        <p className="text-neutral-700">{product.category.name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        {product.promotionPrice ? (
                            <>
                                <p className="font-bold text-xl">{getFormettedPrice(product.promotionPrice)}</p>
                                <p className="text-sm line-through">{getFormettedPrice(product.price)}</p>
                            </>
                        ) : (
                            <p className="font-bold text-xl">{getFormettedPrice(product.price)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;