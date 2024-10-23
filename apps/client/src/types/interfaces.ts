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
  quantity: number;
}

export interface Category {
    id: string,
    name: string
}
