import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

export interface DialogProps {
    loading?: boolean;
    open: boolean;
    closeDialog: () => void;
    dialogAction?: () => void;
    title?: string;
    content?: string;
    deletion?: boolean;
}

const Dialog = ({ loading = false, open, dialogAction, closeDialog, content, title, deletion }: DialogProps) => {

    const [isOpen, setIsOpen] = useState(open);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setIsOpen(true); 
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
            const timer = setTimeout(() => setIsOpen(false), 300); 
            return () => clearTimeout(timer); 
        }
    }, [open]);

    if (!isOpen) return null;
    
    return (
        <>
            <div 
            className={`fixed inset-0 top-0 z-50 right-0 w-screen h-screen transition-all duration-150 ${animate ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="w-full h-full bg-black/80" onClick={() => closeDialog()}>
                </div>
                <div className={`w-full p-4 rounded-md max-w-lg absolute top-[50%] right-[50%] -translate-y-[50%] translate-x-[50%] bg-white border ${animate ? "scale-100" : "scale-90"} transition-all duration-100`}>
                    {title && (
                        <div className="w-full mb-4">
                            <h1 className="font-semibold text-lg">{title}</h1>
                        </div>
                    )}
                    {content && (
                        <div className="mb-12">
                            <p className="text-sm text-neutral-700">{content}</p>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 justify-end">
                        {deletion ? (
                            <button className='p-2 bg-red-500 text-white rounded-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center h-10' onClick={() => dialogAction && dialogAction()}>{loading ? <ReactLoading type="spin" width={15} height={15} /> : "Editar" }</button>
                        ) : (
                            <button className='p-2 bg-black text-white rounded-sm font-semibold hover:bg-neutral-900 transition-colors h-10' onClick={() => dialogAction && dialogAction()}>{loading ? <ReactLoading type="spin" width={15} height={15} /> : "Salvar" }</button>
                        )}
                        <button className='p-2 border rounded-sm hover:bg-neutral-100 transition-colors' onClick={() => closeDialog()}>Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dialog;