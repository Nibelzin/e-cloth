export class UserDTO{
    id?: string
    clerkId: string
    firstName: string
    lastname?: string
    email: string
    phone?: string
    addresses?: Object[]
    orders?: Object[]
}

export class UserPhoneDTO{
    clerkId: string
    phone: string
}