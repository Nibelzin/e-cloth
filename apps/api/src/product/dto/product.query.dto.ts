export enum SortingTypes {
    "PriceDesc",
    "PriceAsc"
}

export class GetProductsQueryDTO{
    search?: string
    itemsPerPage?: string
    page?: string
    sorting?: SortingTypes
}

