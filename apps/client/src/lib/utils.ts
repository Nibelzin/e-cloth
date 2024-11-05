import { Product, ProductInCart, Size } from "../types/interfaces";

export const getFormattedPrice = (price?: number) => {
  if (price || price === 0)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
};

export const getFormattedPhoneNumber = (phoneNumber?: string) => {
  if (phoneNumber){
    const ddd = phoneNumber.slice(0, 2);
    const prefix = phoneNumber.slice(2, 7);
    const suffix = phoneNumber.slice(7, 11);
  
    return `(${ddd}) ${prefix}-${suffix}`;
  }
};

export const matchIdAndSize = (
  item: ProductInCart,
  product: Product,
  size: Size
) => item.id === product.id && item.size === size;
