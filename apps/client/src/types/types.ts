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
  category?: Category;
  price: number;
  promotionPrice?: number;
  description?: string;
  createdAt?: Date;
  removedAt?: Date;
  productImages: ProductImage[];
  productStock?: ProductStock
}

export interface ProductFormData {
  id : string
  name: string
  idCategory: string
  description: string
  price: number
  promotionPrice?: number
  productStock: {
    quantity: number
  }
  productImages: ProductImage[]
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
  id?: string;
  name: string;
  categorySizes: Size[];
}

export interface CategoryDTO {
  id: string;
  name: string;
  categorySizes: {
    size: {
      size: string;
    }
  }[];
  _count? : {
    products: number
  }
}

export interface ProductImage {
  id: string
  productId?: string
  url: string
  alt: string
  position: number
}

export interface Size {
  id?: string;
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
  price: string;
  promotionPrice?: string;
  images?: File[];
  stock: number;
}

export interface CategoryFormValues {
  name: string;
  sizes: string[];
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
  position?: number
  file: File
}

export interface updatedProductResponse {
  product: Product,
  imagesToRemove: ProductImage[]
}

export enum SortingTypes {
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc',
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc',
  StockAsc = 'StockAsc',
  StockDesc = 'StockDesc',
  CategoryAsc = 'CategoryAsc',
  CategoryDesc = 'CategoryDesc'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  SHIPPED = 'SHIPPED'
}

export interface Order {
  id?: string
  userId: string
  orderDate: Date
  status: OrderStatus
  totalPrice: number
  paymentIntentId: string
  shippingAddressId: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  id?: string
  productId: string
  sizeId: string
  quantity: number
  price: number
}


