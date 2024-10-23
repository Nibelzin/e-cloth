import { Product, ProductInCart, Size } from "../types/interfaces"

export const getFormettedPrice = (price?: number) => {
  if(price || price === 0)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

export const matchIdAndSize = (item:ProductInCart, product:Product, size:Size) => item.id === product.id && item.size === size