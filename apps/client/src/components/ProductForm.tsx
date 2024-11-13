import { useEffect, useState } from 'react';
import { Category, ProductFormValues } from '../types/interfaces';
import { getCategories } from '../api/categoryService';
import { FormProvider, useForm } from 'react-hook-form';
import DropzoneField from './DropzoneField';


const ProductForm = () => {

    const methods = useForm<ProductFormValues>()
    const { register, handleSubmit } = methods

    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<File[]>([])
    

    const onSubmit = (data: ProductFormValues) => {
        console.log(data)
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
                                <p className="mb-2 text-sm">Nome</p>
                                <input type="text" className="border p-1 w-full" {...register("name")} />
                            </div>
                            <div className="w-full">
                                <div className='flex gap-2 items-center mb-2'>
                                    <p className="text-sm">Categoria</p>
                                    <a className='text-xs text-blue-400 cursor-pointer'>Adicionar</a>
                                </div>
                                <select className="border p-1 w-full" {...register("idCategory")} >
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
                                <DropzoneField name="images" multiple images={images} setImages={setImages}/>
                            </div>
                        </div>
                        <div className="w-full flex mb-4 gap-4">
                            <div className='w-full'>
                                <p className="mb-2 text-sm">Preço</p>
                                <input type="text" className="border p-1 w-full" {...register("price")} />
                            </div>
                            <div className='w-full'>
                                <p className="mb-2 text-sm">Preço Promocional?</p>
                                <input type="text" className="border p-1 w-full" {...register("promotionPrice")} />
                            </div>
                        </div>
                        <div className="w-full flex mb-4 gap-4">
                            <div className='w-full'>
                                <p className="mb-2 text-sm">Estoque</p>
                                <input type="number" className="border p-1 w-full" {...register("stock")} />
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

