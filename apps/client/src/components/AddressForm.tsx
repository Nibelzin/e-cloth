import { useForm } from "react-hook-form";
import Input from "./Input";

interface AddressFormProps{
    closeForm: () => void
}

const AddressForm = ({ closeForm }: AddressFormProps) => {
    const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm()

    const onSubmit = (e: object) => {
        console.log(e)
    }

    const checkCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep !== '') {
            try {
                const response = await fetch(`http://localhost:3000/api/address/cep/${cep}`)
                const data = await response.json()
                console.log(data)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const value = e.target.value;

        if (value) {
            clearErrors(fieldName)
            console.log(fieldName)
            console.log(errors)
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

    return (
        <div className="shadow-md border p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-sm font-bold text-dark mb-4">Adicionar endereço</h2>
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
                    <button type="button" className="py-[0.375rem] px-[0.75rem] text-neutral-700 hover:bg-alpha text-sm font-semibold focus:shadow-focused transition-all" onClick={() => closeForm()}>Cancelar</button>
                    <button type="submit" className="py-[0.375rem] px-[0.75rem] text-white bg-[#2F3037] text-sm font-semibold focus:shadow-focused transition-all">Add</button>
                </div>
            </form>
        </div>
    );
}

export default AddressForm;