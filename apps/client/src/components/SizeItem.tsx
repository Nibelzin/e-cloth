import { useSortable } from "@dnd-kit/sortable";
import { FaTrash } from "react-icons/fa6";
import { CSS } from '@dnd-kit/utilities';
import { LuGrip } from "react-icons/lu";

interface SizeItemProps {
    size: string
    index: number
    removeSize: (index: number) => void
}

const SizeItem = ({ size, index, removeSize }: SizeItemProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: size });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };



    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-2 border-b bg-white"
        >
            <div className="flex gap-2 items-center justify-center">
                <div
                    {...attributes}
                    {...listeners}
                    className="text-neutral-500">
                    <LuGrip />
                </div>
                <p>{size}</p>
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={() => removeSize(index)}>
                    <FaTrash size={15} color="red" />
                </button>
            </div>
        </div>
    );
}

export default SizeItem;