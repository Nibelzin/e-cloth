import { FaPlus } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import AddressForm from "./AddressForm";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAddressStore } from "../store/addressStore";
import ReactLoading from "react-loading";
import { deleteUserAddress } from "../api/userService";



const AdditionalInfo = () => {

    const { user } = useUser()
    const { addresses, fetchAddresses } = useAddressStore();

    const [openAddressForm, setOpenAddressForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openAdressOptions, setOpenAddressOptions] = useState<string | null>(null)

    const dropdownsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const handleCloseAddressFormButtonClick = (refetch?: boolean) => {
        if(user && refetch){
            setLoading(true)
            fetchAddresses(user.id, setLoading)
        }
        setOpenAddressForm(false)
    }

    const handleDeleteAddressButtonClick = async (addressId: string) => {
        setLoading(true)
        await deleteUserAddress(addressId)
        if(user) fetchAddresses(user.id, setLoading)
    }

    useEffect(() => {
        if (user && addresses.length === 0) {
            setLoading(true)
            fetchAddresses(user.id, setLoading)
        }
    }, [user, addresses.length, fetchAddresses])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInside = Object.values(dropdownsRefs.current).some(ref => ref && ref.contains(event.target as Node))

            if (!isClickInside) {
                setOpenAddressOptions(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dropdownsRefs])

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
                    {loading ?
                        <div className="w-full flex justify-center items-center">
                            <ReactLoading type="spin" width={15} height={15} color="black" />
                        </div>
                        :
                        (
                            <div className="flex justify-between items-center mb-1 w-full">
                                <div className="space-y-4 w-full">
                                    {addresses.map(address => (
                                        <>
                                            <div className="flex justify-between items-center" key={address.id}>
                                                <div>
                                                    <div className="flex gap-2 items-center mb-2">
                                                        <p className="text-sm">{address.street}, {address.number}</p>
                                                        {address.isDefault && (
                                                            <span className="text-[0.6875rem] border bg-background text-accent py-[0.0625rem] px-[0.375rem] font-semibold">Principal</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs">CEP {address.postalCode} - {address.state} - {address.city}</p>
                                                    </div>
                                                </div>
                                                <div className="relative" ref={el => (dropdownsRefs.current[address.id] = el)}>
                                                    <button className="text-accent hover:bg-alpha hover:opacity-100 p-[0.125rem] opacity-[0.62] focus:shadow-focused transition-all" onClick={() => setOpenAddressOptions(openAdressOptions === address.id ? null : address.id)}>
                                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.01 10H10M4.01 10H4M16.01 10H16"></path></g>
                                                        </svg>
                                                    </button>
                                                    <div className={`bg-white border absolute z-50 right-0 top-8 w-fit drop-shadow-xl p-[0.125rem] ${openAdressOptions === address.id ? "visible opacity-100" : "invisible opacity-0 -translate-y-1"} transition-all duration-75 ease-in`}>
                                                        <button className="text-xs font-semibold truncate py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha">Editar</button>
                                                        <hr className="mx-[0.75rem] my-[0.25rem]" />
                                                        <button disabled={address.isDefault} className={`text-xs font-semibold truncate py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha ${address.isDefault && "text-accent"} `} title={address.isDefault ? "Este já é seu endereço principal" : undefined}>Definir como principal</button>
                                                        <hr className="mx-[0.75rem] my-[0.25rem]" />
                                                        <button className="text-xs font-semibold truncate text-red-500 py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha" onClick={() => handleDeleteAddressButtonClick(address.id)}>Remover Endereço</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    {openAddressForm ?
                        (
                            <AddressForm closeForm={handleCloseAddressFormButtonClick} />
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