import { FaPlus } from "react-icons/fa6";
import ProductsTable from "../components/ProductsTable";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import CategoryForm from "../components/CategoryForm";
import CategoriesTable from "../components/CategoriesTable";

const ProductManagement = () => {

    const [openForm, setOpenForm] = useState<'product' | 'category' | null>(null)
    const [openTable, setOpenTable] = useState<'product' | 'category'>('product')

    const [productToEditId, setProductToEditId] = useState<string | null>(null)

    const toggleForm = (form: 'product' | 'category') => {
        setOpenForm(openedForm => openedForm === form ? null : form)
    }

    const handleEdictProduct = (productId: string) => {
        setProductToEditId(productId)
        setOpenForm('product')
    }

    const handleCloseForm = () => {
        setOpenForm(null)
        setProductToEditId(null)
    }

    useEffect(() => {
        setProductToEditId(null)
    }, [])


    return (
        <div className="my-16 p-4 flex w-full">
            {openForm === 'product' && (
                <ProductForm closeForm={handleCloseForm} productToEditId={productToEditId} />
            )}

            {openForm === 'category' && (
                <CategoryForm closeForm={handleCloseForm} />
            )}

            {openForm === null && (
                <div className="w-full flex flex-col items-center space-y-4">
                    <div className="flex gap-4">
                        <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2" onClick={() => toggleForm('product')}>
                            <FaPlus size={25} className="mb-2" />
                            <p className="font-semibold">Adicionar Produto</p>
                        </button>
                        <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2" onClick={() => toggleForm('category')}>
                            <FaPlus size={25} className="mb-2" />
                            <p className="font-semibold">Adicionar Categoria</p>
                        </button>
                    </div>
                    <div className="w-full relative">
                        <div className="absolute -top-9">
                            <button className={`p-2 border-t border-l text-sm font-semibold ${openTable === "product" ? "bg-white" : "bg-neutral-100 outline outline-1 -outline-offset-1 outline-neutral-200"} transition-colors`} onClick={() => setOpenTable("product")}>Produtos</button>
                            <button className={` p-2 z-0 border-t border-r text-sm font-semibold ${openTable === "category" ? "bg-white" : "outline outline-1 -outline-offset-1 outline-neutral-200 bg-neutral-100"} transition-colors`} onClick={() => setOpenTable("category")}>Categorias</button>
                        </div>
                        { openTable === "product" ? (
                            <ProductsTable editProduct={handleEdictProduct} />
                        ) : (
                            <CategoriesTable/>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManagement;