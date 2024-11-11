import { Link } from "react-router-dom";
import { getFormattedPrice} from "../lib/utils";
import { Product } from "../types/interfaces";

interface ProductCardProps {
    product: Product
    page?: "home" | "productDetail"
}

const ProductCard = ({ product, page = "home" }: ProductCardProps) => {
    return (
        <Link to={`/product/${product.id}`}>
            <div className={`bg-white ${page === "home" ? "min-w-42" : "min-w-52"} max-w-72 h-80 border cursor-pointer rounded-sm overflow-hidden flex flex-col`}>
                <div className="w-full h-44">
                    <img src={product.productImages[0].url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                    <div className="">
                        <h1 className="lg:text-lg text-sm uppercase" title={product.name}>{product.name}</h1>
                        <p className="text-neutral-700">{product.category.name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        {product.promotionPrice ? (
                            <div className="flex flex-col md:flex-row-reverse md:items-center md:gap-2">
                                <p className="text-sm line-through">{getFormattedPrice(product.price)}</p>
                                <p className="font-bold text-xl">{getFormattedPrice(product.promotionPrice)}</p>
                            </div>
                        ) : (
                            <p className="font-bold text-xl">{getFormattedPrice(product.price)}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;