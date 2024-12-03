export enum SortingTypes {
    "PriceDesc",
    "PriceAsc"
}

export class GetProductsQueryDTO{
    term?: string
    itemsPerPage?: string
    page?: string
    sorting?: SortingTypes
}

export class GetCategoriesQueryDTO{
    term?: string
    itemsPerPage?: string
    page?: string
}
