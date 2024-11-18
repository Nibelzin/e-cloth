import { useForm } from "react-hook-form";
import Input from "./Input";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { Address, AddressFields, AddressFormValues, AddressToAdd } from "../types/types";
import { addUserAddress, editUserAddress } from "../api/userService";

interface AddressFormProps {
    closeForm: (refetch?: boolean, editMode?: boolean) => void
    mode?: "add" | "edit",
    addressToEdit?: Address
}

const AddressForm = ({ closeForm, mode = "add", addressToEdit }: AddressFormProps) => {

    const { user } = useUser()
    const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<AddressFormValues>()

    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: AddressFormValues) => {
        console.log(e)
        setLoading(true)

        if (!user) return

        if (mode === "add") {
            const address: AddressToAdd = { ...e, clerkId: user.id }
            await addUserAddress(address)
        } else {
            const address: Address = { ...e, id: addressToEdit?.id }
            await editUserAddress(address)
        }

        setLoading(false)
        closeForm(true, mode === "edit" && true)
    }

    const checkCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep !== '') {
            try {
                const response = await fetch(`http://localhost:3000/api/address/cep/${cep}`)
                const data = await response.json()
                setValue("state", data.estado)
                setValue("city", data.localidade)
                setValue("district", data.bairro)
                setValue("street", data.logradouro)
                clearErrors("district")
                clearErrors("street")
            } catch (e) {
                console.log(e)
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: AddressFields) => {
        const value = e.target.value;

        if (value) {
            clearErrors(fieldName)
        }

        setValue(fieldName, value)
    }

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/\D/g, '');

        if (cep.length > 5) {
            cep = cep.replace(/(\d{5})(\d)/, '$1-$2')
        }

        e.target.value = cep
        handleInputChange(e, "postalCode")
    }

    useEffect(() => {
        if (addressToEdit && mode === "edit") {
            setValue("postalCode", addressToEdit.postalCode)
            setValue("state", addressToEdit.state)
            setValue("city", addressToEdit.city)
            setValue("district", addressToEdit.district)
            setValue("street", addressToEdit.street)
            setValue("number", addressToEdit.number)
            setValue("complement", addressToEdit.complement)
        }
    }, [addressToEdit, mode, setValue])

    return (
        <div className="shadow-md border p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-sm font-bold text-dark mb-4">{mode === "add" ? "Adicionar Endereço" : "Editar Endereço"}</h2>
                <div className="mb-4">
                    <Input
                        label="CEP *"
                        register={register}
                        name="postalCode"
                        onBlur={checkCep}
                        onChange={handleCepChange}
                        maxLength={9}
                        options={{
                            required: 'Por favor informe um CEP'
                        }}
                        error={errors.postalCode}
                    />
                    {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message?.toString()}</p>}
                </div>
                <div className="flex gap-2 mb-4">
                    <div>
                        <Input label="Estado *" register={register} name="state" disabled onChange={e => handleInputChange(e, "state")} />
                    </div>
                    <div>
                        <Input label="Cidade *" register={register} name="city" disabled />
                    </div>
                </div>
                <div className="mb-4">
                    <Input
                        label="Bairro *"
                        register={register}
                        name="district"
                        error={errors.district}
                        onChange={e => handleInputChange(e, "district")}
                        options={{
                            required: 'Por favor informe um bairro'
                        }}
                    />
                    {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message?.toString()}</p>}
                </div>
                <div className="flex gap-2 mb-4">
                    <div>
                        <Input
                            label="Rua/Avenida *"
                            register={register}
                            name="street"
                            error={errors.street}
                            onChange={e => handleInputChange(e, "street")}
                            options={{
                                required: 'Por favor informe uma rua/avenida'
                            }}
                        />
                        {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message?.toString()}</p>}
                    </div>
                    <div>
                        <Input
                            label="Número *"
                            register={register}
                            name="number" error={errors.number}
                            onChange={e => handleInputChange(e, "number")}
                            options={{
                                required: 'Por favor informe um número'
                            }}
                        />
                        {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number.message?.toString()}</p>}
                    </div>
                </div>
                <div className="mb-4">
                    <Input label="Complemento (opcional)" register={register} name="complement" />
                </div>
                <div className="flex gap-2 justify-end">
                    <button type="button" className="py-[0.375rem] px-[0.75rem] text-neutral-700 hover:bg-alpha text-sm font-semibold focus:shadow-focused transition-all" onClick={() => closeForm(false, mode === "edit" && true)}>Cancelar</button>
                    <button type="submit" className="py-[0.375rem] px-[0.75rem] text-white bg-[#2F3037] text-sm font-semibold focus:shadow-focused transition-all flex items-center justify-center">{loading ? <ReactLoading type="spin" width={15} height={15} /> : mode === "add" ? "Add" : "Salvar"}</button>
                </div>
            </form>
        </div>
    );
}

export default AddressForm;