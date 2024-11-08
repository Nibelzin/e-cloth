export class ProductDTO {
    id?: string
    idCategory: string 
    name: string
    description: string
    price: number
    promotionPrice?: number
    productImages?: ProductImageDTO[]
}

export class ProductImageDTO{
    id?: string
    productId: string
    url: string
    alt: string
}

