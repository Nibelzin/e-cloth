import { FaPlus } from "react-icons/fa6";
import ProductsTable from "../components/ProductsTable";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

const ProductManagement = () => {

    const [openProductForm, setOpenProductForm] = useState(false)
    const [productToEditId, setProductToEditId] = useState<string | null>(null)

    const handleEdictProduct = (productId: string) => {
        setProductToEditId(productId)
        setOpenProductForm(true)
    }

    const handleCloseProductForm = () => {
        setOpenProductForm(false)
        setProductToEditId(null)
    }

    useEffect(() => {
        setProductToEditId(null)
    }, [])


    return (
        <div className="my-16 p-4 flex w-full">
            {openProductForm ? (
                <ProductForm closeForm={handleCloseProductForm} productToEditId={productToEditId}/>
            ) : (
                <div className="w-full flex flex-col items-center space-y-4">
                <div className="flex gap-4">
                    <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2" onClick={() => setOpenProductForm(true)}>
                        <FaPlus size={25} className="mb-2" />
                        <p className="font-semibold">Adicionar Produto</p>
                    </button>
                    <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2">
                        <FaPlus size={25} className="mb-2" />
                        <p className="font-semibold">Adicionar Categoria</p>
                    </button>
                </div>
                <div className="w-full">
                    <ProductsTable editProduct={handleEdictProduct}/>
                </div>
            </div>
            )}
        </div>
    );
}

export default ProductManagement;