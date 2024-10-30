import React from "react";
import { FieldError, FieldErrorsImpl, FieldValues, Merge, RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
    label: string
    register: UseFormRegister<FieldValues>
    name: string
    className?: string
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    disabled?: boolean
    options?: RegisterOptions
    maxLength?: number
    error?: FieldError | Merge<FieldError, FieldErrorsImpl>
}

const Input: React.FC<InputProps> = ({ label, register, name, onBlur, onChange, className, options, error, ...rest }) => {
    return (
        <div className={`w-full ${className}`}>
            <p className={`text-sm text-accent font-semibold mb-1 ${rest.disabled && 'text-neutral-400'} ${error && 'text-red-500'}`}>{label}</p>
            <input type="text" {...register(name, options)} {...rest} onBlur={onBlur} onChange={onChange} className={`border w-full focus-within:shadow-focused focus-within:border-neutral-400 py-[0.375rem] px-[0.75rem] text-sm focus:outline-none transition-all ${rest.disabled && 'border-dashed text-neutral-400'}`} />
        </div>
    );
}

export default Input;