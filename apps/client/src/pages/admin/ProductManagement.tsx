import { useEffect, useState } from "react"
import CategoriesTable from "../../components/CategoriesTable"
import CategoryForm from "../../components/CategoryForm"
import ProductForm from "../../components/ProductForm"
import ProductsTable from "../../components/ProductsTable"
import { FaPlus } from "react-icons/fa6"


enum EntityType {
    PRODUCT = 'product',
    CATEGORY = 'category'
}

const formComponents = {
    [EntityType.PRODUCT]: ProductForm,
    [EntityType.CATEGORY]: CategoryForm
}

const tableComponents = {
    [EntityType.PRODUCT]: ProductsTable,
    [EntityType.CATEGORY]: CategoriesTable
}

const ProductManagement = () => {

    const [openForm, setOpenForm] = useState<EntityType | null>(null)
    const [openTable, setOpenTable] = useState<EntityType>(EntityType.PRODUCT)

    const [productToEditId, setProductToEditId] = useState<string | null>(null)
    const [categoryToEditId, setCategoryToEditId] = useState<string | null>(null)

    const toggleForm = (form: EntityType) => {
        setOpenForm(openedForm => openedForm === form ? null : form)
    }

    const handleEdictProduct = (productId: string) => {
        setProductToEditId(productId)
        setOpenForm(EntityType.PRODUCT)
    }

    const handleEdictCategory = (categoryId: string) => {
        setCategoryToEditId(categoryId)
        setOpenForm(EntityType.CATEGORY)
    }

    const handleCloseForm = () => {
        setOpenForm(null)
        setProductToEditId(null)
        setCategoryToEditId(null)
    }

    useEffect(() => {
        setProductToEditId(null)
    }, [])

    const FormComponent = openForm ? formComponents[openForm] : null
    const TableComponent = tableComponents[openTable]


    return (
        <div className="my-16 p-4 flex w-full">
            {FormComponent ? (
                <FormComponent productToEditId={productToEditId} categoryToEditId={categoryToEditId} closeForm={handleCloseForm} />
            ):(
                <div className="w-full flex flex-col items-center">
                    <div className="flex gap-4 mb-14">
                        <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2" onClick={() => toggleForm(EntityType.PRODUCT)}>
                            <FaPlus size={25} className="mb-2" />
                            <p className="font-semibold">Adicionar Produto</p>
                        </button>
                        <button className="w-40 h-40 bg-white border rounded-sm flex flex-col justify-center items-center p-2" onClick={() => toggleForm(EntityType.CATEGORY)}>
                            <FaPlus size={25} className="mb-2" />
                            <p className="font-semibold">Adicionar Categoria</p>
                        </button>
                    </div>
                    <div className="w-full relative">
                        <div className="absolute -top-9">
                            <button className={`p-2 border-t border-l text-sm font-semibold ${openTable === "product" ? "bg-white" : "bg-neutral-100 outline outline-1 -outline-offset-1 outline-neutral-200"} transition-colors`} onClick={() => setOpenTable(EntityType.PRODUCT)}>Produtos</button>
                            <button className={` p-2 z-0 border-t border-r text-sm font-semibold ${openTable === "category" ? "bg-white" : "outline outline-1 -outline-offset-1 outline-neutral-200 bg-neutral-100"} transition-colors`} onClick={() => setOpenTable(EntityType.CATEGORY)}>Categorias</button>
                        </div>
                        <TableComponent editCategory={handleEdictCategory} editProduct={handleEdictProduct}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManagement;