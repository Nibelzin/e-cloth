import { FaMagnifyingGlass } from "react-icons/fa6";
import { getFormattedPrice } from "../lib/utils";
import { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import { Product } from "../types/interfaces";

const ProductsTable = () => {

    const [products, setProducts] = useState<Product[] | null>([])

    const fetchProducts = async () => {
        try {
            const fetchedProducts = await getProducts()
            await setProducts(fetchedProducts)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <table className="bg-white p-2 w-full border rounded-sm table-auto">
            <thead className="border-b">
                <tr>
                    <th colSpan={4} className="px-4 py-4 text-left justify-between">
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold">Produtos</p>
                            <div className=" bg-gray-200 px-4 flex gap-2 items-center">
                                <div>
                                    <FaMagnifyingGlass size={15} className="text-gray-500" />
                                </div>
                                <input type="text" className="bg-gray-200 p-2 w-full font-semibold focus:outline-none focus:ring-0" placeholder="Procurar por nome" />
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th className="py-2 text-left px-4 font-semibold">Nome</th>
                    <th className="py-2 text-left px-4 font-semibold">Categoria</th>
                    <th className="py-2 text-left px-4 font-semibold">Preço</th>
                    <th className="py-2 text-left px-4 font-semibold">Ações</th>
                </tr>
            </thead>
            <tbody className="">
                {products?.map(product => (
                    <tr key={product.id}>
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4">{product.category.name}</td>
                        <td className="py-2 px-4">{getFormattedPrice(product.price)}</td>
                        <td className="py-2 px-4">
                        <div className="flex gap-2">
                            <button>Excluir</button>
                            <button>Editar</button>
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ProductsTable;