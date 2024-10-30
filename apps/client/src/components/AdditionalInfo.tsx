import { FaPlus } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import AddressForm from "./AddressForm";
import { useState } from "react";



const AdditionalInfo = () => {

    const [openAddressForm, setOpenAddressForm] = useState(false)

    const handleCloseAddressFormButtonClick = () => {
        setOpenAddressForm(false)
    }


    return (
        <div>
            <h1 className="font-bold text-md">Informações Adicionais</h1>
            <hr className="my-4" />
            <div className="flex my-6 flex-col lg:flex-row justify-between">
                <p className="text-xs font-semibold mb-3">Telefone</p>
                <div className="flex justify-between items-center lg:w-2/3">
                    <p className="text-sm">(11) 94533-6668</p>
                    <div>
                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 text-accent"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.01 10H10M4.01 10H4M16.01 10H16"></path></g>
                        </svg>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="my-6 flex flex-col lg:flex-row  justify-between">
                <p className="text-xs font-semibold mb-3">Endereços</p>
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex gap-2 items-center mb-2">
                            <p className="text-xs">R. Jan Van Kessel, 66</p>
                            <span className="text-[0.6875rem] border bg-background text-accent py-[0.0625rem] px-[0.375rem] font-semibold">Principal</span>
                        </div>
                        <button className="text-accent hover:bg-alpha hover:opacity-100 p-[0.125rem] opacity-[0.62] focus:shadow-focused transition-all">
                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.01 10H10M4.01 10H4M16.01 10H16"></path></g>
                            </svg>
                        </button>
                    </div>
                    {openAddressForm ?
                        (
                            <AddressForm closeForm={handleCloseAddressFormButtonClick}/>
                        ) : (
                            <button className="w-full flex items-center gap-2 hover:bg-alpha p-2 focus:shadow-focused transition-all group" onClick={() => setOpenAddressForm(true)}>
                                <FaPlus size={12} className="text-accent" />
                                <p className="text-xs font-semibold">Adicionar Endereço</p>
                                <IoArrowForward className="text-accent opacity-0 w-0 group-hover:w-5 group-hover:opacity-[0.75] transition-all" />
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AdditionalInfo;