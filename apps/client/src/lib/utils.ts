export const getFormettedPrice = (price?: number) => {
  if(price)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }