import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CategoryDTO } from "../types/types";
import { getCategories } from "../api/categoryService";
import { getArrayAsString } from "../lib/utils";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface CategoriesTableProps {
    editCategory: (categoryId: string) => void
}

const CategoriesTable = ({ editCategory }: CategoriesTableProps) => {

    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const [itemsPerPage, setItemsPerPage] = useState<number>(5)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
    const [numOfCategories, setNumOfCategories] = useState<number>(0)

    const [loading, setLoading] = useState(false)

    const numOfPages = Math.ceil(numOfCategories / itemsPerPage)

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
        setLoading(true)
        const fetchCategories = async () => {
            try {
                const { categories: dbCategories, total } = await getCategories(itemsPerPage, currentPage, searchTerm)
                setCategories(dbCategories)
                setNumOfCategories(total)
            }
            catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [itemsPerPage, currentPage, searchTerm])

    return (
        <table className="bg-white p-2 w-full border rounded-sm table-auto">
            <thead className="border-b">
                <tr>
                    <th colSpan={4} className="px-4 py-4 text-left justify-between">
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
                    <th className="py-2 text-left px-4 font-semibold">Tamanhos</th>
                    <th className="py-2 text-left px-4 font-semibold">Produtos</th>
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

                    categories.map((category, index) => (
                        <tr key={category.id} className={`${index % 2 === 0 && "bg-neutral-100"}`}>
                            <td className="py-2 px-4">{category.name}</td>
                            <td className="py-2 px-4">{getArrayAsString(category.categorySizes.map(categorySize => categorySize.size.size))}</td>
                            <td className="py-2 px-4">{category._count?.products} Produtos</td>
                            <td className="py-2 px-4">
                                <button className="text-blue-500" onClick={() => editCategory(category.id)}>Editar</button>
                            </td>
                        </tr>))
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

export default CategoriesTable;