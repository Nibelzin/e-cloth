import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import SizeItem from "./SizeItem";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Category, CategoryFormValues } from "../types/types";
import { createCategory, getCategories } from "../api/categoryService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

interface CategoryFormProps {
    closeForm: () => void
}

const CategoryForm = ({ closeForm }: CategoryFormProps) => {

    const [existingCategories, setExistingCategories] = useState<Category[]>([])

    const [sizes, setSizes] = useState<string[]>([])
    const [openAddSizeInput, setOpenAddSizeInput] = useState(false)
    const [loading, setLoading] = useState(false)

    const addSizeInput = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm<CategoryFormValues>()

    register("sizes", {
        required: "Adicione pelo menos um tamanho"
    })

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            setSizes(images => {
                const oldIndex = images.findIndex(size => size === active.id)
                const newIndex = images.findIndex(size => size === over.id)
                return arrayMove(images, oldIndex, newIndex)
            })
        }
    }

    const handleAddSizes = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && addSizeInput.current) {
            const sizesToAdd = addSizeInput.current.value
                .split(',')
                .map(size => size.trim())
                .filter(size => size !== '')

            const newSizes = sizesToAdd.filter(size => !sizes.includes(size))

            if (newSizes.length > 0) {
                setSizes([...sizes, ...newSizes])
            } else if (sizes.length === 0) {
                setSizes([...sizes, "PP", "P", "M", "G", "GG"])
            }

            setOpenAddSizeInput(false)
        }
        if (e.key === 'Escape') {
            setOpenAddSizeInput(false)
        }
    }

    const handleRemoveSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index))
    }

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true)

        const newCategory: Category = {
            id: "",
            name: data.name,
            sizes: sizes.map(size => ({ size: size.toLocaleUpperCase() }))
        }

        try{
            await createCategory(newCategory)
            toast.success("Categoria adicionada com sucesso")
            closeForm()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao adicionar categoria")
        } finally {
            setLoading(false)
        }
    }


    const fetchExistingCategories = async () => {
        try {
            setExistingCategories(await getCategories())
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar categorias")
        }
    }


    useEffect(() => {
        if (openAddSizeInput && addSizeInput.current) {
            addSizeInput.current.focus();
        }
    }, [openAddSizeInput]);

    useEffect(() => {
        fetchExistingCategories()
    })

    useEffect(() => {
        setValue("sizes", sizes)
        if(sizes.length > 0){
            clearErrors("sizes")
        }
    }, [sizes, setValue, clearErrors])

    return (
        <div className="w-4/5 flex justify-center bg-white border rounded-sm">
            <form className="w-full p-4 flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <h2 className="text-2xl mb-4 font-semibold">Adicionar Categoria</h2>
                    <div className="w-full mb-4">
                        <p className={`text-sm mb-2 ${errors.name && "text-red-500"}`}>Nome</p>
                        <input type="text" className="border p-2 w-full" {...register("name", {
                            required: "Por favor informe o nome da categoria",
                            validate: (value) => !existingCategories.some(category => category.name === value) || "Categoria já existe"
                        })} />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="w-full mb-4">
                        <p className={`text-sm mb-2 ${errors.sizes && "text-red-500"}`}>Tamanhos da Categoria</p>
                        <div className="border">
                            {sizes.length === 0 && openAddSizeInput === false && (
                                <div className="p-2 border-b">
                                    <p className="text-sm text-neutral-500">Sem Tamanhos</p>
                                </div>
                            )}
                            <DndContext
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <SortableContext items={sizes}>
                                    {sizes.map((size, index) => (
                                        <SizeItem key={index} size={size} index={index} removeSize={handleRemoveSize} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            {openAddSizeInput && (
                                <div className="p-2 border-b">
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="PP, P, M, G, GG"
                                        ref={addSizeInput}
                                        onBlur={() => setOpenAddSizeInput(false)}
                                        onKeyDown={handleAddSizes} />
                                    <p className="text-sm text-neutral-500 mt-2">Pressione Enter para adicionar</p>
                                </div>
                            )}
                            <div className="p-2 flex justify-end">
                                <button type="button" onClick={() => setOpenAddSizeInput(true)}>Adicionar Tamanhos</button>
                            </div>
                        </div>
                        {errors.sizes && <p className="text-xs text-red-500 mt-1">{errors.sizes.message}</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button type='button' className='p-2 border rounded-sm' onClick={() => closeForm()}>Cancelar</button>
                    <button type='submit' className='p-2 bg-black text-white rounded-sm font-semibold'>{loading ? <ReactLoading type="spin" width={15} height={15} /> : "Adicionar"}</button>
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;