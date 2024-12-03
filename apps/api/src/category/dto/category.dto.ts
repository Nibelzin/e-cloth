export class ProductCategoryDTO{
    id?: string
    name: string
    categorySizes: ProductCategorySizeDTO[]
}

export class ProductCategorySizeDTO{
    id?: string
    size: string
    categories: ProductCategoryDTO[]
}