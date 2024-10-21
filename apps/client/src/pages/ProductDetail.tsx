import ProductCard from "../components/ProductCard";
import { productsMock } from "../lib/mock";

const ProductDetail = () => {
    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-64 py-16">
            <div className="flex flex-col lg:flex-row gap-4 mb-32">
                <div className="w-full lg:w-3/5 overflow-hidden border">
                    <img src="/products/hat_1.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="mb-4">
                            <p className="text-neutral-700">Bonés</p>
                            <h1 className="uppercase text-2xl font-semibold mb-4">Stylish Hat 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem velit sequi repellat illum vero assumenda repellendus fugit modi. Facilis cupiditate ratione enim impedit consequatur ad obcaecati veritatis animi voluptates soluta.</p>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-2xl font-bold">R$ 29,90</p>
                            <p className="line-through">R$ 40,00</p>
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