import { useEffect, useState } from 'react';
import { CategoryDTO, PreviewImage, Product, ProductFormData, ProductFormValues, ProductImage } from '../types/types';
import { getCategories } from '../api/categoryService';
import { FormProvider, useForm } from 'react-hook-form';
import DropzoneField from './DropzoneField';
import { v4 as uuid } from 'uuid';
import { getValueFormattedToCurrency } from '../lib/utils';
import { createProduct, createProductImages, getProductById, softDeleteProduct, updateProduct } from '../api/productService';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import Dialog from './Dialog';


interface ProductFormProps {
    closeForm: () => void
    productToEditId?: string | null
}

const ProductForm = ({ closeForm, productToEditId }: ProductFormProps) => {


    const methods = useForm<ProductFormValues>({
        defaultValues: {
            stock: 0,
            price: "0,00"
        }
    })

    const { register, handleSubmit, setValue, formState: { errors } } = methods

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const [images, setImages] = useState<PreviewImage[]>([])
    const [sumbmitButtonLoading, setSumbmitButtonLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [productToEdit, setProductToEdit] = useState<Product | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const onSubmit = async (data: ProductFormValues) => {
        setSumbmitButtonLoading(true)
        try {
            const productId = productToEditId ? productToEditId : uuid()
            const imageIds = images.map(image => image.id)

            const productImagesData = new FormData();
            images.forEach(image => {
                productImagesData.append("images", image.file)
            })
            productImagesData.append("imageIds", JSON.stringify(imageIds))
            productImagesData.append("productId", productId)

            const createdImages: ProductImage[] = await createProductImages(productImagesData)

            if (productToEditId) {

                const productImages: ProductImage[] = images.map<ProductImage>((image, index) => {
                    const isNewImage = createdImages.find(createdImage => createdImage.id === image.id)
                    if (isNewImage) {
                        return {
                            id: isNewImage.id,
                            url: isNewImage.url,
                            alt: isNewImage.alt,
                            position: index
                        }
                    } else {
                        const productImage: ProductImage = {
                            id: image.id,
                            url: image.url!,
                            alt: image.alt!,
                            position: index
                        }

                        return productImage
                    }
                })

                const productData: ProductFormData = {
                    id: productId,
                    name: data.name,
                    idCategory: data.idCategory,
                    description: data.description,
                    price: parseFloat(data.price.replace(/\D/g, "")) / 100,
                    promotionPrice: data.promotionPrice ? parseFloat(data.promotionPrice.replace(/\D/g, "")) / 100 : undefined,
                    productStock: {
                        quantity: Number(data.stock)
                    },
                    productImages: productImages
                }

                await updateProduct(productData)
                toast.success("Produto editado com sucesso!")
            } else {
                const productData: ProductFormData = {
                    id: productId,
                    name: data.name,
                    idCategory: data.idCategory,
                    description: data.description,
                    price: parseFloat(data.price.replace(/\D/g, "")) / 100,
                    promotionPrice: data.promotionPrice ? parseFloat(data.promotionPrice.replace(/\D/g, "")) / 100 : undefined,
                    productStock: {
                        quantity: Number(data.stock)
                    },
                    productImages: createdImages.map(image => {
                        return {
                            id: image.id,
                            url: image.url,
                            alt: image.alt,
                            position: image.position
                        }
                    })
                }

                await createProduct(productData)
                toast.success("Produto adicionado com sucesso!")
            }

            closeForm()

        } catch (error) {
            console.error(error)
            toast.error("Erro ao adicionar produto")
        } finally {
            setSumbmitButtonLoading(false)
        }

    }

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>, promotionPrice?: boolean) => {
        const formattedValue = getValueFormattedToCurrency(e.target.value, promotionPrice)
        if (promotionPrice) {
            setValue("promotionPrice", formattedValue)
        } else {
            setValue("price", formattedValue)
        }
    }

    const handleDeleteProduct = async () => {
        setDeleteLoading(true)
        try {
            if (productToEditId) {
                await softDeleteProduct(productToEditId)
                toast.success("Produto removido com sucesso!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro ao remover produto")
        } finally {
            setOpenDialog(false)
            closeForm()
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categories: dbCateogies } = await getCategories()
                setCategories(dbCateogies)
                setValue("idCategory", dbCateogies[0].id!)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchProductToEdit = async (productId: string) => {
            try {
                const result = await getProductById(productId)
                setProductToEdit(result)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchCategoriesAndProductToEdit = async () => {
            setFormLoading(true)
            await fetchCategories()
            if (productToEditId) {
                await fetchProductToEdit(productToEditId)
            }
            setFormLoading(false)
        }

        fetchCategoriesAndProductToEdit()
    }, [productToEditId, setValue])

    useEffect(() => {
        const fetchImages = async () => {
            if (productToEdit) {
                const previewImages: PreviewImage[] = productToEdit.productImages.map(image => {
                    const imageFile = new File([new Blob([image.url])], image.url)

                    return {
                        ...image,
                        file: imageFile,
                    }
                })

                previewImages.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))


                setImages(previewImages)
                setValue("images", previewImages.map(image => image.file).filter((file): file is File => file !== undefined))
            }
        }

        if (productToEdit) {
            setValue("name", productToEdit?.name)
            setValue("description", productToEdit.description || "")
            setValue("price", getValueFormattedToCurrency((productToEdit.price * 100).toString()))
            if (productToEdit.promotionPrice) {
                setValue("promotionPrice", getValueFormattedToCurrency((productToEdit.promotionPrice * 100).toString()))
            }
            setValue("stock", productToEdit.productStock?.quantity || 0)

            fetchImages()
        }
    }, [productToEdit, setValue])

    return (
        <>
            <div className="w-4/5 flex justify-center bg-white border rounded-sm">
                <FormProvider {...methods}>
                    <form className="w-full p-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="text-2xl mb-4 font-semibold">{productToEditId ? "Editar Produto" : "Adicionar Produto"}</h2>
                        {formLoading ? (
                            <div className="w-full flex-col justify-center p-4 space-y-4 h-full">
                                <div className='flex gap-4'>
                                    <div className="w-full bg-gray-300 h-8 animate-pulse rounded-sm">
                                    </div>
                                    <div className="w-full bg-gray-300 h-8 animate-pulse rounded-sm">
                                    </div>
                                </div>
                                <div className="w-full bg-gray-300 h-64 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-gray-300 h-16 animate-pulse rounded-sm">
                                </div>
                                <div className="w-full bg-gray-300 h-16 animate-pulse rounded-sm">
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col justify-between h-full'>
                                <div className="w-full mb-4 flex gap-4">
                                    <div className="w-full">
                                        <p className={`mb-2 text-sm ${errors.name && "text-red-500"}`}>Nome</p>
                                        <input type="text" className={`border p-2 w-full`} {...register("name", {
                                            required: 'Por favor informe o nome do produto'
                                        })} />
                                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div className="w-full">
                                        <div className='flex gap-2 items-center mb-2'>
                                            <p className="text-sm">Categoria</p>
                                            <a className='text-xs text-blue-400 cursor-pointer'>Adicionar</a>
                                        </div>
                                        <select className="border p-2 w-full" {...register("idCategory")} >
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full mb-4">
                                    <div>
                                        <p className="mb-2 text-sm">Descrição</p>
                                        <textarea className="border p-1 w-full resize-none" rows={3} {...register("description")}></textarea>
                                    </div>
                                </div>
                                <div className="w-full mb-4">
                                    <p className="mb-2">Imagens do Produto</p>
                                    <div className='flex gap-4'>
                                        <DropzoneField name="images" multiple images={images} setImages={setImages} />
                                    </div>
                                    {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images.message}</p>}
                                </div>
                                <div className="w-full flex mb-4 gap-4">
                                    <div className='w-full'>
                                        <p className={`mb-2 text-sm ${errors.price && "text-red-500"}`}>Preço</p>
                                        <div className='flex border'>
                                            <input
                                                type="text"
                                                className={`border-r p-2 w-full`}
                                                {...register("price", {
                                                    validate: value => {
                                                        if (value === "0,00") {
                                                            return 'Por favor informe o preço do produto'
                                                        }
                                                        return true
                                                    }
                                                })}
                                                onChange={handlePriceInputChange}
                                            />
                                            <div className='flex px-2 items-center justify-center'>
                                                <span className='text-sm'>R$</span>
                                            </div>
                                        </div>
                                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                                    </div>
                                    <div className='w-full'>
                                        <p className="mb-2 text-sm">Preço Promocional?</p>
                                        <div className='flex border'>
                                            <input type="text"
                                                className="border-r p-2 w-full"
                                                {...register("promotionPrice")}
                                                placeholder='Sem preço promocional'
                                                onChange={(e) => handlePriceInputChange(e, true)}
                                            />
                                            <div className='flex px-2 items-center justify-center'>
                                                <span className='text-sm'>R$</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex mb-4 gap-4">
                                    <div className='w-full'>
                                        <p className="mb-2 text-sm">Estoque</p>
                                        <input type="number" className="border p-2 w-full" {...register("stock")} />
                                    </div>
                                    <div className='w-full'>
                                    </div>
                                </div>
                                <div className={`flex ${productToEditId ? "justify-between" : "justify-end"} items-center`}>
                                    {productToEditId && <a className='text-red-500 cursor-pointer' onClick={() => setOpenDialog(true)}>Remover Produto</a>}
                                    <div className='flex gap-2'>
                                        <button type='button' className='p-2 border rounded-sm' onClick={() => closeForm()}>Cancelar</button>
                                        <button disabled={sumbmitButtonLoading} type='submit' className='p-2 bg-black text-white rounded-sm font-semibold'>{sumbmitButtonLoading ? <ReactLoading type="spin" width={15} height={15} /> : productToEditId ? "Editar" : "Adicionar"}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </FormProvider>
            </div>
            <Dialog
                loading={deleteLoading}
                open={openDialog}
                closeDialog={() => setOpenDialog(false)}
                deletion={true}
                dialogAction={handleDeleteProduct}
            >
                <Dialog.Title>Deseja excuir o produto {productToEdit?.name}?</Dialog.Title>
                <Dialog.Description>As imagens do produto serão excluídas permanentemente após 90 dias, e ele só sera visivel em pedidos já realizados, deseja continuar?</Dialog.Description>
                <Dialog.ActionButtons />
            </Dialog>
        </>
    );

}

export default ProductForm;

