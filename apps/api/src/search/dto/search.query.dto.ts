export enum SortingTypes {
    "PriceDesc",
    "PriceAsc"
}

export class GetProductsQueryDTO{
    itemsPerPage?: string
    page?: string
    sorting?: SortingTypes
}

