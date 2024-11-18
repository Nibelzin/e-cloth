export interface User {
  id?: string;
  clerkId?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  addresses?: Address[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  promotionPrice?: number;
  description?: string;
  productImages: ProductImage[];
  productStock?: ProductStock
}

export interface ProductStock {
  id: string
  quantity: number
  updatedAt: Date
}

export interface ProductInCart extends Product {
  size: Size;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  sizes: Size[];
}

export interface ProductImage {
  id: string
  url: string
  alt: string
}

export interface Size {
  id: string;
  size: string;
}

export interface Address {
  id?: string;
  userId?: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface AddressToAdd extends Address {
  clerkId: string;
}

export interface PhoneFormValues {
  phone: string;
}

export interface ProductFormValues {
  name: string;
  idCategory: string;
  description: string;
  price: number;
  promotionPrice?: number;
  images?: FileList;
  stock: number;
}

export type AddressFormValues = Pick<
  Address,
  | "postalCode"
  | "state"
  | "city"
  | "district"
  | "street"
  | "number"
  | "complement"
>;

export type AddressFields = Exclude<
  keyof Address,
  "id" | "userId" | "isDefault"
>;

export interface FileWithDbImage extends File {
  id?: string
  url?: string
  alt?: string
}

export interface PreviewImage {
  id: string
  url?: string
  alt?: string
  file?: File
}