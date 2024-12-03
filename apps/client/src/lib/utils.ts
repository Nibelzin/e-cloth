import { Product, ProductInCart, Size } from "../types/types";

export const getFormattedPrice = (price?: number) => {
  if (price || price === 0)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
};

export const getValueFormattedToCurrency = (value: string, promotionPrice?: boolean) => {
    if(value === ""){
      if(promotionPrice){
        return ""
      } else {
        return "0,00"
      }
    }

    const numericValue = value.replace(/\D/g, "");

    const numberValue = parseFloat(numericValue) / 100;

    return numberValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export const getFormattedPhoneNumber = (phoneNumber?: string) => {
  if (phoneNumber){
    const ddd = phoneNumber.slice(0, 2);
    const prefix = phoneNumber.slice(2, 7);
    const suffix = phoneNumber.slice(7, 11);
  
    return `(${ddd}) ${prefix}-${suffix}`;
  }
};

export const getArrayAsString = (array: string[]) => {
  return array.join(", ");
}

export const matchIdAndSize = (
  item: ProductInCart,
  product: Product,
  size: Size
) => item.id === product.id && item.size === size;
