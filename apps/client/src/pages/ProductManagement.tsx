import { FaPlus } from "react-icons/fa6";
import ProductsTable from "../components/ProductsTable";
import { useState } from "react";
import ProductForm from "../components/ProductForm";

const ProductManagement = () => {

    const [openProductForm, setOpenProductForm] = useState(true)


    return (
        <div className="my-16 p-4 flex w-full">
            {openProductForm ? (
                <ProductForm/>
            ) : (
                <div className="w-full flex flex-col items-center space-y-4">
                <div className="flex gap-4">
                    <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2">
                        <FaPlus size={25} className="mb-2" />
                        <p className="font-semibold">Adicionar Produto</p>
                    </button>
                    <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2">
                        <FaPlus size={25} className="mb-2" />
                        <p className="font-semibold">Adicionar Categoria</p>
                    </button>
                </div>
                <div className="w-full">
                    <ProductsTable />
                </div>
            </div>
            )}
        </div>
    );
}

export default ProductManagement;