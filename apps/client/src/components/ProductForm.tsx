import { useEffect, useState } from 'react';
import { Category, PreviewImage, ProductFormData, ProductFormValues, ProductImage } from '../types/types';
import { getCategories } from '../api/categoryService';
import { FormProvider, useForm } from 'react-hook-form';
import DropzoneField from './DropzoneField';
import { v4 as uuid } from 'uuid';
import { getValueFormattedToCurrency } from '../lib/utils';
import { createProduct, createProductImages } from '../api/productService';


const ProductForm = () => {

    const methods = useForm<ProductFormValues>({
        defaultValues: {
            stock: 0,
            price: "0,00"
        }
    })
    const { register, handleSubmit, setValue, formState: { errors } } = methods

    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<PreviewImage[]>([])


    const onSubmit = async (data: ProductFormValues) => {
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

            console.log(productData)

            const createdProduct = await createProduct(productData)
            console.log(createdProduct)
        } catch (error) {
            console.log(error)
        }

    }

    const fetchImages = async () => {
        const imagesFromDb: ProductImage[] = [
            { id: uuid(), url: "https://www.galaxcommerce.com.br/sistema/upload/3785/produtos/bolsa-louis-vuitton-passy-bag-monogram_2022-05-16_14-37-25_3_427.jpg", alt: "Imagem 1" },
            { id: uuid(), url: "https://acdn.mitiendanube.com/stores/001/406/075/products/54f3caf9-3da9-400a-b3a5-f43b715c8cbe1-0f30d7d539e8abb67916332281687283-640-0.jpeg", alt: "Imagem 2" },
        ];

        const previewImages: PreviewImage[] = imagesFromDb.map(image => {
            const imageFile = new File([new Blob([image.url])], image.url)

            return {
                ...image,
                file: imageFile
            }
        })

        setImages(previewImages)
        setValue("images", previewImages.map(image => image.file).filter((file): file is File => file !== undefined))
    }

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>, promotionPrice?: boolean) => {
        const formattedValue = getValueFormattedToCurrency(e.target.value, promotionPrice)
        if (promotionPrice) {
            setValue("promotionPrice", formattedValue)
        } else {
            setValue("price", formattedValue)
        }
    }


    const fetchCategories = async () => {
        try {
            const result = await getCategories()
            setCategories(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchImages()
        fetchCategories()
    }, [])

    return (
        <div className="w-4/5 flex justify-center bg-white border rounded-sm">
            <FormProvider {...methods}>
                <form action="" className="w-full p-4 flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Adicionar Produto</h2>
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
                    </div>
                    <div className='flex justify-end'>
                        <div className='flex gap-2'>
                            <button type='button' className='p-2 border rounded-sm'>TESTE</button>
                            <button type='submit' className='p-2 bg-black text-white rounded-sm font-semibold'>Adicionar</button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );

}

export default ProductForm;

