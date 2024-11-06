import { useForm } from "react-hook-form";
import Input from "./Input";
import { alterUserPhoneNumber } from "../api/userService";
import { useUser } from "@clerk/clerk-react";
import { PhoneFormValues } from "../types/interfaces";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { getFormattedPhoneNumber } from "../lib/utils";

interface PhoneFormProps {
    closeForm: (refetch?: boolean, editMode?: boolean) => void
    mode?: "add" | "edit",
    phoneToEdit?: string | undefined
}

const PhoneForm = ({ closeForm, mode = "add", phoneToEdit}: PhoneFormProps) => {

    const { user } = useUser()
    const { register, setValue, handleSubmit } = useForm<PhoneFormValues>()

    const [loading, setLoading] = useState(false)

    const getOnlyNumbersOfPhone = (phoneNumber: string) => {
        return phoneNumber.replace(/\D/g, '')
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue("phone", value)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let phone = getOnlyNumbersOfPhone(e.target.value)

        if (phone.length > 10) {
            phone = phone.replace(/^\s*(\d{2})[-. ]?(\d{5})[-. ]?(\d{4})\s*$/, '($1) $2-$3');
        }

        e.target.value = phone;
        handleInputChange(e);
    };

    const onSubmit = async (e: PhoneFormValues) => {
        setLoading(true)

        const phone = getOnlyNumbersOfPhone(e.phone)

        if (user) {
            await alterUserPhoneNumber(user.id, phone)
        }

        setLoading(false)
        closeForm(true, mode === "edit" && true)
    }

    useEffect(() => {
        if (phoneToEdit && mode === "edit") {
            const formattedPhoneToEdit = getFormattedPhoneNumber(phoneToEdit) || ""
            setValue("phone", formattedPhoneToEdit)
        }
    }, [phoneToEdit, mode, setValue])



    return (
        <div className="shadow-md border p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-sm font-bold text-dark mb-4">{mode === "edit" ? "Editar Telefone" : "Adicionar Telefone"}</h2>
                <div className="mb-4">
                    <Input label="Número *" name="phone" register={register} placeholder="(11) 12345-6789" onChange={handlePhoneChange} maxLength={15} />
                </div>
                <div className="flex gap-2 justify-end">
                    <button type="button" className="py-[0.375rem] px-[0.75rem] text-neutral-700 hover:bg-alpha text-sm font-semibold focus:shadow-focused transition-all" onClick={() => closeForm(false, mode === "edit" && true)}>Cancelar</button>
                    <button type="submit" className="py-[0.375rem] px-[0.75rem] text-white bg-[#2F3037] text-sm font-semibold focus:shadow-focused transition-all flex items-center justify-center">{loading ? <ReactLoading type="spin" width={15} height={15} /> : mode === "edit" ? "Salvar" : "Add"}</button>
                </div>
            </form>
        </div>
    );
}

export default PhoneForm;