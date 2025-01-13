import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";

interface DialogProps extends PropsWithChildren {
    loading?: boolean;
    open: boolean;
    closeDialog: () => void;
    dialogAction?: () => void;
    deletion?: boolean;
    className?: string;
}

type DialogContext = {
    loading?: boolean;
    closeDialog: () => void;
    dialogAction?: () => void;
    deletion?: boolean;
}

const DialogContext = createContext<DialogContext | undefined>(undefined);

const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialogContext must be used within a Dialog");
    }

    return context;
}

const Dialog = ({ children, open, dialogAction, closeDialog, deletion, loading, className }: DialogProps) => {

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
        <DialogContext.Provider value={{ closeDialog, dialogAction, deletion, loading }}>
            <div
                className={`fixed inset-0 top-0 z-50 right-0 w-screen h-screen transition-all duration-150 ${animate ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="w-full h-full bg-black/80" onClick={() => closeDialog()}>
                </div>
                <div className={`min-w-[32rem] max-w-full p-4 rounded-md absolute top-[50%] right-[50%] -translate-y-[50%] translate-x-[50%] bg-white border ${animate ? "scale-100" : "scale-90"} ${className} transition-all duration-100`}>
                    {children}
                </div>
            </div>
        </DialogContext.Provider>
    );
}

Dialog.Title = function Title({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-2">
            <h1 className="font-semibold text-lg">{children}</h1>
        </div>
    )
}

Dialog.Description = function Description({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <p className="text-sm text-neutral-700">{children}</p>
        </div>
    )
}

Dialog.Body = function Body({ children }: { children?: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}

Dialog.ActionButtons = function ActionButtons({ primaryButtonLabel }: { primaryButtonLabel?: string }) {
    const { closeDialog, dialogAction, deletion, loading } = useDialogContext();

    return (
        <div className="flex flex-col mt-4 gap-2 justify-end">
            {deletion ? (
                <button className='p-2 bg-red-500 text-white rounded-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center h-10' onClick={() => dialogAction && dialogAction()}>{loading ? <ReactLoading type="spin" width={15} height={15} /> : "Excluir"}</button>
            ) : (
                <button disabled={loading} className='p-2 bg-black text-white rounded-sm font-semibold hover:bg-neutral-900 transition-colors h-10' onClick={() => dialogAction && dialogAction()}>{loading ? <ReactLoading type="spin" width={15} height={15} /> : primaryButtonLabel ?? "Salvar"}</button>
            )}
            <button className='p-2 border rounded-sm hover:bg-neutral-100 transition-colors' onClick={() => closeDialog()}>Cancelar</button>
        </div>
    )
}

export default Dialog;