export class ProductDTO {
    id?: string
    idCategory: string 
    name: string
    description: string
    price: number
    promotionPrice?: number
    productImages?: ProductImageDTO[]
    productStock?: ProductStockDTO
}

export class ProductImageDTO{
    id?: string
    productId: string
    url: string
    alt: string
}

export class ProductStockDTO{
    id?: string
    productId: string
    quantity: number
    updatedAt: Date
}

export class ProductPreviewImageDTO{
    id: string
    file: Express.Multer.File
  }


