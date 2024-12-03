export enum SortingTypes {
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc',
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc',
  StockAsc = 'StockAsc',
  StockDesc = 'StockDesc',
  CategoryAsc = 'CategoryAsc',
  CategoryDesc = 'CategoryDesc',
}

export class GetProductsQueryDTO {
  term?: string;
  itemsPerPage?: string;
  page?: string;
  sorting?: SortingTypes;
}

export class GetCategoriesQueryDTO {
  term?: string;
  itemsPerPage?: string;
  page?: string;
}
