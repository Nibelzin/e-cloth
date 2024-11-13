import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { FaArrowUpFromBracket, FaX } from "react-icons/fa6";

interface DropzoneFieldProps {
    name: string,
    multiple?: boolean,
    images: File[],
    setImages: Dispatch<SetStateAction<File[]>>
}

interface DropzoneProps {
    multiple?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    images: File[],
    handleRemoveImage: (index: number) => void,
    handleDrop: (acceptedFiles: File[]) => void
}

const DropzoneField = ({ name, multiple, images, setImages, ...rest }: DropzoneFieldProps) => {

    const { control, setValue } = useFormContext()

    const handleDrop = (acceptedFiles: File[]) => {
        const updatedImages = [...images, ...acceptedFiles];
        setImages(updatedImages);
        setValue(name, updatedImages)
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            const updatedImages = [...images, ...newFiles]
            setImages(updatedImages)
            setValue(name, updatedImages)
        }
    }

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        setValue(name, updatedImages)
    }


    return (
        <Controller
            render={({ field: { onChange } }) => (
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
                />
            )}
            name={name}
            control={control}
            defaultValue=""
        />
    );
}

const Dropzone = ({ multiple, onChange, images, handleRemoveImage, handleDrop, ...rest }: DropzoneProps) => {

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple,
        ...rest
    })

    return (
        <>
            <div {...getRootProps()} className={`p-6 border border-dashed h-32 flex flex-col items-center justify-center cursor-pointer ${images.length > 0 ? "w-32" : "w-full"}`}>
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
            <div className='flex gap-2'>
                {images && Array.from(images).map((image: File, index) => (
                    <div key={index} className="flex gap-2 items-center w-32 h-32 relative">
                        <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            className='object-cover w-full h-full'
                            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(image))}
                        />
                        <div className="absolute top-2 right-2 bg-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border" onClick={() => handleRemoveImage(index)}>
                            <FaX size={12} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default DropzoneField;