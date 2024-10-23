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
