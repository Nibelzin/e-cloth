import { PhoneNumberJSON } from "@clerk/clerk-sdk-node"

export interface ClerkUserEventData {
    id: string
    email_addresses: Array<{email_address: string}>
    first_name: string
    last_name?: string
    phone_numbers?: PhoneNumberJSON[]
}