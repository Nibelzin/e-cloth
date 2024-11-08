export class ProductCategoryDTO{
    id?: string
    name: string
    sizes: ProductCategorySizeDTO[]
}

export class ProductCategorySizeDTO{
    id?: string
    size: string
    categories: ProductCategoryDTO[]
}