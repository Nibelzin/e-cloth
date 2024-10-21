export interface Product {
  id: string,
  name: string,
  category: Category,
  price: number,
  promotionPrice?: number,
  imgs: string[];
}

export interface Category {
    id: string,
    name: string
}
