import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productsMock } from "../lib/mock";
import { getFormattedPrice } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Product } from "../types/types";
import { getProductById } from "../api/productService";



const ProductDetail = () => {
    const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>(undefined)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedProductImage, setSelectedProductImage] = useState<string | null>(null)

    const [zoomImage, setZoomImage] = useState<boolean>(false)
    const zoomImageRef = useRef<HTMLImageElement>(null)

    const { id: productId } = useParams();


    const handleImageZoomIn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setZoomImage(true)
    }

    const handleImageZoomOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setZoomImage(false)
    }

    const handleImageZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (zoomImageRef.current) {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - left
            const y = e.clientY - top
            const xPercent = (x / width) * 100
            const yPercent = (y / height) * 100
            zoomImageRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`
        }
    }

    const addItemToCart = useCartStore((state) => state.addItem);

    const handleAddToCartButtonClick = () => {
        console.log("teste")
        const selectedSize = selectedProduct?.category?.categorySizes.find(size => size.id === selectedSizeId)
        if (selectedSize && selectedProduct) {
            addItemToCart(selectedProduct, selectedSize)
        } else {
            alert("SELECIONE UM TAMANHO")
        }
    }

    useEffect(() => {
        const fetchSelectedProduct = async () => {
            try {
                if (productId) {
                    const result = await getProductById(productId)
                    setSelectedProduct(result)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSelectedProduct()
    }, [])

    useEffect(() => {
        setSelectedProductImage(selectedProduct?.productImages[0].url ?? null)
    }, [selectedProduct])


    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <div className="flex flex-col lg:flex-row gap-4 mb-32">
                <div className="w-full lg:w-3/5">
                    <div className="overflow-hidden border relative"
                    onMouseEnter={handleImageZoomIn}
                    onMouseLeave={handleImageZoomOut}
                    onMouseMove={handleImageZoom}
                    >
                        <img src={selectedProductImage ?? ""} alt="" className="w-full h-full object-cover" />
                        { zoomImage && (
                            <img 
                            src={selectedProductImage ?? ""} 
                            alt="" 
                            className="w-full h-full object-cover absolute scale-[200%] top-10" 
                            ref={zoomImageRef}
                            />
                        )}
                    </div>
                    <div className="mt-2 flex gap-2">
                        {selectedProduct?.productImages.map(image => (
                            <div className="w-32 h-32 border overflow-hidden cursor-pointer" key={image.id}>
                                <img src={image.url} alt="" className="w-full h-full object-cover" onClick={() => setSelectedProductImage(image.url)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="mb-4">
                            <p className="text-neutral-700">{selectedProduct?.category?.name}</p>
                            <h1 className="uppercase text-2xl font-semibold mb-4">{selectedProduct?.name}</h1>
                            <p>{selectedProduct?.description}</p>
                        </div>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            {selectedProduct?.promotionPrice ? (
                                <>
                                    <p className="text-2xl font-bold">{getFormattedPrice(selectedProduct?.promotionPrice)}</p>
                                    <p className="line-through">{getFormattedPrice(selectedProduct?.price)}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold">{getFormattedPrice(selectedProduct?.price)}</p>
                            )}
                        </div>
                        <div>
                            <p className="mb-2">Tamanho</p>
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {selectedProduct?.category?.categorySizes.flatMap(size => (
                                    <button key={size.id} className={`flex p-2 w-14 justify-center border rounded-full hover:border-black transition-all ${selectedSizeId === size.id ? "border-black ring-2" : ""}`} onClick={() => setSelectedSizeId(size.id)}>
                                        <p>{size.size}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="bg-black p-4 hover:bg-neutral-800 rounded-full transition-all text-white" onClick={handleAddToCartButtonClick}>Adicionar ao carrinho</button>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Você Também pode gostar</h2>
                <div className="flex overflow-x-auto gap-4">
                    {productsMock.map(product => (
                        <ProductCard key={product.id} product={product} page="productDetail" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;