export class AddressDTO{
    id?: string
    userId?: string
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    postalCode: string
    isDefault?: boolean
}

export class CreateAddressDTO extends AddressDTO{
    clerkId: string
}