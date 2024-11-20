import { FaX } from "react-icons/fa6";
import { PreviewImage } from "../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface ImagePreviewProps {
    image: PreviewImage
    index: number
    handleRemoveImage: (index: number) => void
}

const ImagePreview = ({ image, index, handleRemoveImage }: ImagePreviewProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className="relative w-fit h-fit"
            style={style}
        >
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className="flex gap-2 items-center w-32 h-32 overflow-hidden rounded-sm"
            >
                <img
                    src={image.url ? image.url : image.file && URL.createObjectURL(image.file)}
                    alt={image.alt}
                    className='object-cover w-full h-full'
                    onLoad={() => image.file && URL.revokeObjectURL(URL.createObjectURL(image.file))}
                />
            </div>
            <div className="absolute top-2 right-2 bg-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border" onClick={() => handleRemoveImage(index)} >
                <FaX size={12} />
            </div>
            { index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-400 py-1 px-2 rounded-full">
                    <p className="text-xs text-white">Foto de capa</p>
                </div>
            ) }
        </div>
    );
}

export default ImagePreview;