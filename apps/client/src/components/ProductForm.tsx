import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { FaArrowUpFromBracket, FaX } from 'react-icons/fa6';

type PreviewFile = FileWithPath & { preview: string };

const ProductForm = () => {


    const [images, setImages] = useState<PreviewFile[]>([])

    const handleRemoveImageButtonClick = (imageToRemove: PreviewFile) => {
        setImages(images.filter(image => image !== imageToRemove))
    }

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        if (acceptedFiles?.length) {
            setImages(previousImages => [
                ...previousImages,
                ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
            ])
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        }
    });

    return (
        <div className="w-4/5 flex justify-center bg-white border rounded-sm">
            <form action="" className="w-full p-4">
                <h2 className="text-2xl font-semibold mb-4">Adicionar Produto</h2>
                <div className="w-full mb-4 flex gap-4">
                    <div className="w-full">
                        <p className="mb-2 text-sm">Nome</p>
                        <input type="text" className="border p-1 w-full" />
                    </div>
                    <div className="w-full">
                        <p className="mb-2 text-sm">Categoria</p>
                        <select className="border p-1 w-full" >

                        </select>
                    </div>
                </div>
                <div className="w-full mb-4">
                    <div>
                        <p className="mb-2 text-sm">Descrição</p>
                        <textarea name="" id="" className="border p-1 w-full resize-none" rows={3}></textarea>
                    </div>
                </div>
                <div className="w-full mb-4">
                    <p className="mb-2">Imagens do Produto</p>
                    <div className='flex gap-4'>
                        <div {...getRootProps({ className: `flex flex-col justify-center items-center border border-dashed p-6 cursor-pointer h-40 ${images.length > 0 ? "w-40" : "w-full"}` })}>
                            <input {...getInputProps()} />
                            {images.length > 0 ? (
                                <>
                                    <FaArrowUpFromBracket />
                                    <p>Selecionar</p>
                                </>
                            ) : (
                                <>
                                    <FaArrowUpFromBracket />
                                    <p className='font-semibold'>Selecione ou arraste arquivos pra cá</p>
                                    <p className='text-sm text-neutral-500'>Envie a imagem em formato JPG, JPEG, PNG ou WEBP</p>
                                </>
                            )}
                        </div>
                        {images.length > 0 && (
                            <div className='flex gap-4'>
                                {images.map(image => (
                                    <div className='w-40 h-40 relative border rounded-sm'>
                                        <img src={image.preview} alt="" className='object-cover w-full h-full' />
                                        <div className='absolute top-2 right-2 z-10 w-6 h-6 bg-white flex items-center justify-center rounded-full cursor-pointer border' onClick={() => handleRemoveImageButtonClick(image)}>
                                            <FaX size={10} />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex mb-4 gap-4">
                    <div className='w-full'>
                        <p className="mb-2 text-sm">Preço</p>
                        <input type="text" className="border p-1 w-full" />
                    </div>
                    <div className='w-full'>
                        <p className="mb-2 text-sm">Preço Promocional?</p>
                        <input type="text" className="border p-1 w-full" />
                    </div>
                </div>
                <div className="w-full flex mb-4 gap-4">
                    <div className='w-full'>
                        <p className="mb-2 text-sm">Estoque</p>
                        <input type="number" className="border p-1 w-full" />
                    </div>
                    <div className='w-full'>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;

