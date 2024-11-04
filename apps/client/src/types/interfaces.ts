export interface User{
  id?: string,
  clerkId?: string,
  firstName: string,
  lastName?: string,
  email: string,
  phone? : string,
  addresses?: Address[]
}

export interface Product {
  id: string,
  name: string,
  category: Category,
  price: number,
  promotionPrice?: number,
  description?: string,
  imgs: string[];
}

export interface ProductInCart extends Product {
  size: Size,
  quantity: number;
}

export interface Category {
    id: string,
    name: string,
    sizes: Size[]
}

export interface Size {
  id: string,
  size: string
}

export interface Address{
  id: string,
  userId: string,
  street: string,
  number: string,
  complement?: string,
  district: string,
  city: string,
  state: string,
  postalCode: string,
  isDefault: boolean
}
