import { FaPlus } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import AddressForm from "./AddressForm";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import { deleteUserAddress, deleteUserPhoneNumber, setAddressAsUserDefault } from "../api/userService";
import { Address } from "../types/interfaces";
import { useUserStore } from "../store/userStore";
import { getFormattedPhoneNumber } from "../lib/utils";
import PhoneForm from "./PhoneForm";



const AdditionalInfo = () => {

    const { user } = useUser()
    const { user: storedUser, fetchUser } = useUserStore();

    const [openAddAddressForm, setOpenAddAddressForm] = useState(false)
    const [openEditAddressForm, setOpenEditAddressForm] = useState(false)

    const [openAddPhoneForm, setOpenAddPhoneForm] = useState(false)
    const [openEditPhoneForm, setOpenEditPhoneForm] = useState(false)

    const [phoneLoading, setPhoneLoading] = useState(false)
    const [addressLoading, setAddressLoading] = useState(false)

    const [openAdressOptions, setOpenAddressOptions] = useState<string | null>(null)
    const [openPhoneOptions, setOpenPhoneOptions] = useState(false)

    const [addressToEdit, setAddressToEdit] = useState<Address | undefined>(undefined)

    const dropdownsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const handleSetAddressAsDefaultButtonClick = async (addressId: string) => {
        if (user) {
            setAddressLoading(true)
            await setAddressAsUserDefault(addressId)
            fetchUser(user.id, setAddressLoading)
        }
    }

    const handleEditAddressButtonClick = (address: Address) => {
        setAddressToEdit(address)
        setOpenEditAddressForm(true)
    }

    const handleClosePhoneFormButtonClick = (refetch?: boolean, editMode?: boolean) => {
        if (user && refetch) {
            setPhoneLoading(true)
            fetchUser(user.id, setPhoneLoading)
        }
        if (editMode) {
            setOpenEditPhoneForm(false)
        } else {
            setOpenAddPhoneForm(false)
        }
    }

    const handleCloseAddressFormButtonClick = (refetch?: boolean, editMode?: boolean) => {
        if (user && refetch) {
            setAddressLoading(true)
            fetchUser(user.id, setAddressLoading)
        }
        if (editMode) {
            setOpenEditAddressForm(false)
        } else {
            setOpenAddAddressForm(false)
        }
    }

    const handleDeleteAddressButtonClick = async (addressId: string) => {
        if (user) {
            setAddressLoading(true)
            await deleteUserAddress(addressId)
            fetchUser(user.id, setAddressLoading)
        }
    }

    const handleDeletePhoneNumberButtonClick = async () => {
        if (user) {
            setPhoneLoading(true)
            await deleteUserPhoneNumber(user.id)
            fetchUser(user.id, setPhoneLoading)
        }
    }

    const setPhoneAndAddressLoading = (option: boolean) => {
        if(option === true){
            setPhoneLoading(true)
            setAddressLoading(true)
        } else {
            setPhoneLoading(false)
            setAddressLoading(false)
        }
    }

    useEffect(() => {
        if (user && !storedUser) {
            setPhoneAndAddressLoading(true)
            fetchUser(user.id, setPhoneAndAddressLoading)
        }
    }, [user, storedUser, fetchUser])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInside = Object.values(dropdownsRefs.current).some(ref => ref && ref.contains(event.target as Node))

            if (!isClickInside) {
                setOpenAddressOptions(null)
                setOpenPhoneOptions(false)
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
                <div className={`flex ${storedUser?.phone === null && openAddPhoneForm === false && "items-center"}`}>
                    <p className="text-xs font-semibold mb-3 lg:mb-0">Telefone</p>
                </div>
                <div className=" lg:w-2/3">
                    {openEditPhoneForm && storedUser ? (
                        <PhoneForm closeForm={handleClosePhoneFormButtonClick} phoneToEdit={storedUser.phone} mode="edit" />
                    ) : (
                        phoneLoading ? (
                            <div className="w-full flex justify-center items-center">
                                <ReactLoading type="spin" width={15} height={15} color="black" />
                            </div>
                        ) : (
                            storedUser && storedUser.phone !== null ? (
                                <div className="flex w-full justify-between items-center">
                                    <p className="text-sm">{getFormattedPhoneNumber(storedUser.phone)}</p>
                                    <div className="relative" ref={el => (dropdownsRefs.current["phoneDropdown"] = el)}>
                                        <button className="text-accent hover:bg-alpha hover:opacity-100 p-[0.125rem] opacity-[0.62] focus:shadow-focused transition-all" onClick={() => setOpenPhoneOptions(!openPhoneOptions)}>
                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.01 10H10M4.01 10H4M16.01 10H16"></path></g>
                                            </svg>
                                        </button>
                                        <div className={`bg-white border absolute z-50 right-0 top-8 w-fit drop-shadow-xl p-[0.125rem] transition-all ${openPhoneOptions === true ? "visible opacity-100" : "invisible opacity-0 -translate-y-1"} duration-75 ease-in`}>
                                            <button className="text-xs font-semibold truncate py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha" onClick={() => setOpenEditPhoneForm(true)}>Editar</button>
                                            <hr className="mx-[0.75rem] my-[0.25rem]" />
                                            <button className="text-xs font-semibold truncate text-red-500 py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha" onClick={() => handleDeletePhoneNumberButtonClick()}>Remover Telefone</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                openAddPhoneForm ? (
                                    <PhoneForm closeForm={handleClosePhoneFormButtonClick} />
                                ) : (
                                    <button className="w-full flex items-center gap-2 hover:bg-alpha p-2 focus:shadow-focused transition-all group" onClick={() => setOpenAddPhoneForm(true)}>
                                        <FaPlus size={12} className="text-accent" />
                                        <p className="text-xs font-semibold">Adicionar Telefone</p>
                                        <IoArrowForward className="text-accent opacity-0 w-0 group-hover:w-5 group-hover:opacity-[0.75] transition-all" />
                                    </button>
                                )
                            )
                        )
                    )
                    }
                </div>
            </div>
            <hr className="my-4" />
            <div className="my-6 flex flex-col lg:flex-row  justify-between">
                <div className={`flex ${storedUser?.addresses && storedUser.addresses.length === 0 && openAddAddressForm === false && "items-center"}`}>
                    <p className="text-xs font-semibold mb-3 lg:mb-0">Endereços</p>
                </div>
                <div className="lg:w-2/3">
                    {openEditAddressForm ? (
                        <AddressForm closeForm={handleCloseAddressFormButtonClick} addressToEdit={addressToEdit} mode="edit" />
                    ) : (
                        <>
                            {addressLoading ?
                                <div className="w-full flex justify-center items-center">
                                    <ReactLoading type="spin" width={15} height={15} color="black" />
                                </div>
                                :
                                (
                                    storedUser?.addresses && storedUser.addresses.length > 0 && (
                                        <div className="flex justify-between items-center mb-1 w-full">
                                            <div className="space-y-4 w-full">
                                                {storedUser.addresses.map(address => (
                                                    <div key={address.id}>
                                                        <div className="flex justify-between items-center">
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
                                                            <div className="relative" ref={el => (dropdownsRefs.current[address.id!] = el)}>
                                                                <button className="text-accent hover:bg-alpha hover:opacity-100 p-[0.125rem] opacity-[0.62] focus:shadow-focused transition-all" onClick={() => setOpenAddressOptions(openAdressOptions === address.id! ? null : address.id!)}>
                                                                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.01 10H10M4.01 10H4M16.01 10H16"></path></g>
                                                                    </svg>
                                                                </button>
                                                                <div className={`bg-white border absolute z-50 right-0 top-8 w-fit drop-shadow-xl p-[0.125rem] ${openAdressOptions === address.id ? "visible opacity-100" : "invisible opacity-0 -translate-y-1"} transition-all duration-75 ease-in`}>
                                                                    <button className="text-xs font-semibold truncate py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha" onClick={() => handleEditAddressButtonClick(address)}>Editar</button>
                                                                    <hr className="mx-[0.75rem] my-[0.25rem]" />
                                                                    <button disabled={address.isDefault} className={`text-xs font-semibold truncate py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha ${address.isDefault && "text-accent"} `} title={address.isDefault ? "Este já é seu endereço principal" : undefined} onClick={() => handleSetAddressAsDefaultButtonClick(address.id!)}>Definir como principal</button>
                                                                    <hr className="mx-[0.75rem] my-[0.25rem]" />
                                                                    <button className="text-xs font-semibold truncate text-red-500 py-[0.25rem] px-[0.75rem] w-full hover:bg-alpha" onClick={() => handleDeleteAddressButtonClick(address.id!)}>Remover Endereço</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className="mt-4" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )
                            }
                            {openAddAddressForm ?
                                (
                                    <AddressForm closeForm={handleCloseAddressFormButtonClick} />
                                ) : (
                                    <button className="w-full flex items-center gap-2 hover:bg-alpha p-2 focus:shadow-focused transition-all group" onClick={() => setOpenAddAddressForm(true)}>
                                        <FaPlus size={12} className="text-accent" />
                                        <p className="text-xs font-semibold">Adicionar Endereço</p>
                                        <IoArrowForward className="text-accent opacity-0 w-0 group-hover:w-5 group-hover:opacity-[0.75] transition-all" />
                                    </button>
                                )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AdditionalInfo;