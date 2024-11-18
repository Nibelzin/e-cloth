import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, FieldError, FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { PreviewImage } from "../types/types";
import ImagePreview from "./ImagePreview";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";

interface DropzoneFieldProps {
    name: string,
    multiple?: boolean,
    images: PreviewImage[],
    setImages: Dispatch<SetStateAction<PreviewImage[]>>
}

interface DropzoneProps {
    name: string,
    multiple?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    images: PreviewImage[],
    handleRemoveImage: (index: number) => void,
    handleDrop: (acceptedFiles: File[]) => void,
    setImages: Dispatch<SetStateAction<PreviewImage[]>>
    setValue: UseFormSetValue<FieldValues>
    error: FieldError | undefined
}

const DropzoneField = ({ name, multiple, images, setImages, ...rest }: DropzoneFieldProps) => {

    const { control, setValue, clearErrors } = useFormContext()

    const handleDrop = (acceptedFiles: File[]) => {
        const newImages: PreviewImage[] = acceptedFiles.map(file => {
            return {
                id: uuid(),
                file
            }
        })

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        setValue(name, updatedImages.map(image => image.file))
        clearErrors(name)
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.target.files
        if (files) {
            const newImages: PreviewImage[] = Array.from(files).map(file => {
                return {
                    id: uuid(),
                    file
                }
            })
            const updatedImages = [...images, ...newImages]
            setImages(updatedImages)

            setValue(name, updatedImages.map(image => image.file))
            clearErrors(name)
        }
    }

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)

        setValue(name, updatedImages.length > 0 ? updatedImages.map(image => image.file) : "")
    }


    return (
        <Controller
            render={({ field: { onChange }, fieldState: { error } }) => (
                <Dropzone
                    multiple={multiple}
                    onChange={(e) => {
                        handleFileChange(e)
                        onChange(images)
                    }}
                    {...rest}
                    images={images}
                    handleRemoveImage={handleRemoveImage}
                    handleDrop={handleDrop}
                    setImages={setImages}
                    name={name}
                    setValue={setValue}
                    error={error}
                />
            )}
            name={name}
            rules={{ required: "Campo obrigatório" }}
            control={control}
            defaultValue=""
        />
    );
}

const Dropzone = ({ multiple, onChange, images, name, setImages, handleRemoveImage, setValue, handleDrop, error, ...rest }: DropzoneProps) => {

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            setImages(images => {
                const oldIndex = images.findIndex(image => image.id === active.id)
                const newIndex = images.findIndex(image => image.id === over.id)
                return arrayMove(images, oldIndex, newIndex)
            })

            const imagesList = new DataTransfer();
            images.forEach(image => image.file && imagesList.items.add(image.file))

            setValue(name, imagesList.files)
        }

    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple,
        ...rest
    })

    return (
        <>
            <div {...getRootProps()} className={`p-6 border border-dashed h-32 rounded-sm flex flex-col items-center justify-center cursor-pointer ${images.length > 0 ? "w-32" : "w-full"} ${error && "border-red-500 text-red-500"}`}>
                <input {...getInputProps({ onChange })} />
                <div className="flex flex-col justify-center items-center gap-2">
                    <FaArrowUpFromBracket />
                    {images.length === 0 ? (
                        <p className="font-semibold">Selecione ou arraste os arquivos para cá</p>
                    ) : (
                        <p className="font-semibold">Selecionar</p>
                    )}
                </div>
                {images.length === 0 && (
                    <p className="text-sm text-neutral-500">Envie a imagem em formato JPG, JPEG, PNG ou WEBP</p>
                )}
            </div>
            {images.length > 0 && (
                <div className='flex gap-2 w-full flex-wrap'>
                    <DndContext
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={images}>
                            {images && images.map((image: PreviewImage, index) => (
                                <ImagePreview image={image} key={image.id} index={index} handleRemoveImage={handleRemoveImage} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </>
    )
}

export default DropzoneField;