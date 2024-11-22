import { useEffect, useState } from 'react';
import { Category, PreviewImage, Product, ProductFormData, ProductFormValues, ProductImage } from '../types/types';
import { getCategories } from '../api/categoryService';
import { FormProvider, useForm } from 'react-hook-form';
import DropzoneField from './DropzoneField';
import { v4 as uuid } from 'uuid';
import { getValueFormattedToCurrency } from '../lib/utils';
import { createProduct, createProductImages, getProductById } from '../api/productService';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';


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

    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<PreviewImage[]>([])
    const [sumbmitButtonLoading, setSumbmitButtonLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [productToEdit, setProductToEdit] = useState<Product | null>(null)

    const onSubmit = async (data: ProductFormValues) => {
        setSumbmitButtonLoading(true)
        try {
            const productId = uuid()
            const imageIds = images.map(image => image.id)

            const productImagesData = new FormData();
            images.forEach(image => {
                productImagesData.append("images", image.file)
            })
            productImagesData.append("imageIds", JSON.stringify(imageIds))
            productImagesData.append("productId", productId)

            const createdImages: ProductImage[] = await createProductImages(productImagesData)

            console.log(createdImages)

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
                        alt: image.alt
                    }
                })
            }

            await createProduct(productData)

            toast.success("Produto adicionado com sucesso!")

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

    const fetchImages = async () => {
        if (productToEdit) {
            const previewImages: PreviewImage[] = productToEdit.productImages.map(image => {
                const imageFile = new File([new Blob([image.url])], image.url)

                return {
                    ...image,
                    file: imageFile
                }
            })

            setImages(previewImages)
            setValue("images", previewImages.map(image => image.file).filter((file): file is File => file !== undefined))
        }
    }

    const fetchCategoriesAndProductToEdit = async () => {
        setFormLoading(true)
        await fetchCategories()
        if (productToEditId) {
            console.log(productToEditId)
            await fetchProductToEdit(productToEditId)
        }
        setFormLoading(false)
    }


    const fetchCategories = async () => {
        try {
            const result = await getCategories()
            setCategories(result)
            setValue("idCategory", result[0].id)
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



    useEffect(() => {
        fetchCategoriesAndProductToEdit()
    }, [])

    useEffect(() => {
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
    }, [productToEdit])

    return (
        <div className="w-4/5 flex justify-center bg-white border rounded-sm">
            <FormProvider {...methods}>
                <form action="" className="w-full p-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
                            <div className='flex justify-end'>
                                <div className='flex gap-2'>
                                    <button type='button' className='p-2 border rounded-sm' onClick={() => closeForm()}>Cancelar</button>
                                    <button type='submit' className='p-2 bg-black text-white rounded-sm font-semibold'>{sumbmitButtonLoading ? <ReactLoading type="spin" width={15} height={15} /> : "Adicionar"}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    );

}

export default ProductForm;

