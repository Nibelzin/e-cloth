import { FaMagnifyingGlass } from "react-icons/fa6";
import { getFormattedPrice } from "../lib/utils";
import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import { Product } from "../types/types";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface ProductsTableProps {
    editProduct: (productId: string) => void
}

const ProductsTable = ({ editProduct }: ProductsTableProps) => {

    const [products, setProducts] = useState<Product[]>([])

    const [itemsPerPage, setItemsPerPage] = useState<number>(5)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
    const [numOfProducts, setNumOfProducts] = useState<number>(0)

    const [loading, setLoading] = useState(false)

    const numOfPages = Math.ceil(numOfProducts / itemsPerPage)

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(e.currentTarget.value)
            setCurrentPage(1)
        }
    }



    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const result = await getProducts(itemsPerPage, currentPage, searchTerm)
                setNumOfProducts(result.total)
                await setProducts(result.products)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [itemsPerPage, currentPage, searchTerm])

    return (
        <table className="bg-white p-2 w-full border rounded-sm table-auto">
            <thead className="border-b">
                <tr>
                    <th colSpan={5} className="px-4 py-4 text-left justify-between">
                        <div className="flex justify-between items-center">
                            <div className=" bg-gray-200 px-4 flex gap-2 items-center">
                                <div>
                                    <FaMagnifyingGlass size={15} className="text-neutral-500" />
                                </div>
                                <input type="text" className="bg-neutral-200 p-2 w-full font-semibold focus:outline-none focus:ring-0" placeholder="Procurar" onKeyDown={handleSearch} />
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th className="py-2 text-left px-4 font-semibold">Nome</th>
                    <th className="py-2 text-left px-4 font-semibold">Categoria</th>
                    <th className="py-2 text-left px-4 font-semibold">Preço</th>
                    <th className="py-2 text-left px-4 font-semibold">Qtd em estoque</th>
                    <th className="py-2 text-left px-4 font-semibold">Criado Em</th>
                    <th className="py-2 text-left px-4 font-semibold">Ações</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6}>
                            <div className="w-full flex-col justify-center p-4 space-y-2">
                                <div className="w-full bg-neutral-300 h-6 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-neutral-300 h-6 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-neutral-300 h-6 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-neutral-300 h-6 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-neutral-300 h-6 animate-pulse rounded-sm">
                                </div>
                            </div>
                        </td>
                    </tr>
                ) : (
                    products?.map((product, index) => {


                        const capeImageUrl = product.productImages.find(image => image.position === 0)?.url

                        return (
                            <tr key={product.id} className={`${index % 2 === 0 && "bg-neutral-100"}`}>
                                <td className="py-2 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex w-10 h-10 border bg-white">
                                            <img alt="" src={capeImageUrl} className="object-cover" />
                                        </div>
                                        <p>{product.name}</p>
                                    </div>
                                </td>
                                <td className="py-2 px-4">
                                    <div className="px-2 py-1 bg-white border rounded-full text-sm w-fit">
                                        <span>{product.category ? product.category.name : "Sem Categoria"}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-4">
                                    {product.promotionPrice ? (
                                        <div className="flex gap-2 items-center">
                                            <p className="line-through text-gray-500">{getFormattedPrice(product.price)}</p>
                                            <p className="font-semibold">{getFormattedPrice(product.promotionPrice)}</p>
                                        </div>
                                    ) : <p className="font-semibold">{getFormattedPrice(product.price)}</p>}
                                </td>
                                <td className="py-2 px-4">{product.productStock?.quantity}</td>
                                <td>
                                    {new Date(product.createdAt!).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4">
                                    <div className="flex gap-2">
                                        <a className="cursor-pointer text-blue-500" onClick={() => editProduct(product.id)}>Editar</a>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                )}
            </tbody>
            <tfoot className="border-t">
                <tr>
                    <td colSpan={4} className="px-4 py-4 text-left justify-between">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <p>Itens por página:</p>
                                <select className="border p-1" value={itemsPerPage} onChange={handleItemsPerPageChange} name="" id="">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center">
                                    <button className="flex items-center justify-center w-8 h-8 border hover:bg-neutral-100 transition-colors"><BiChevronLeft size={20} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} /></button>
                                    {Array.from({ length: numOfPages }, (_, index) => {
                                        const page = index + 1
                                        return (
                                            <button
                                                key={page}
                                                className={`flex items-center justify-center w-8 h-8 border-y font-semibold ${currentPage === page && "bg-neutral-100"} hover:bg-neutral-100 transition-colors`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    })}
                                    <button className="flex items-center justify-center w-8 h-8 border hover:bg-neutral-100 transition-colors" onClick={() => numOfPages > currentPage && setCurrentPage(currentPage + 1)}><BiChevronRight size={20} /></button>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}

export default ProductsTable;