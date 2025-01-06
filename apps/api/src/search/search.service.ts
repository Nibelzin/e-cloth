import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetCategoriesQueryDTO,
  GetProductsQueryDTO,
  SortingTypes,
} from './dto/search.query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) { }

  async searchProductsByCategory(
    categoryName: string,
    query: GetProductsQueryDTO,
  ) {
    const { itemsPerPage, page, sorting } = query;

    const take = parseInt(itemsPerPage) || 10;
    const skip = (parseInt(page) - 1) * take || 0;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { price: 'asc' };
    if (sorting === SortingTypes.PriceAsc) {
      orderBy = { price: 'asc' };
    } else if (sorting === SortingTypes.PriceDesc) {
      orderBy = { price: 'desc' };
    }

    const products = await this.prisma.product.findMany({
      take,
      skip,
      orderBy,
      where: {
        category: { name: { equals: categoryName, mode: 'insensitive' } },
      },
      include: {
        category: true,
        productImages: {
          select: {
            id: true,
            url: true,
            alt: true,
            position: true,
          },
        },
        productStock: {
          select: {
            id: true,
            quantity: true,
            updatedAt: true,
          },
        },
      },
    });

    const numOfProducts = await this.prisma.product.count({
      where: {
        category: { name: { equals: categoryName, mode: 'insensitive' } },
      },
    });

    return {
      products,
      total: numOfProducts,
    };
  }

  async searchAllProducts(query: GetProductsQueryDTO) {
    const { itemsPerPage, page, sorting, term } = query;

    const where: Prisma.ProductWhereInput = {
      removedAt: null,
    };

    if (term) {
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { category: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const take = parseInt(itemsPerPage) || 10;
    const skip = (parseInt(page) - 1) * take || 0;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { price: 'asc' };

    switch (sorting) {
      case SortingTypes.PriceAsc:
        orderBy = { price: 'asc' };
        break;
      case SortingTypes.PriceDesc:
        orderBy = { price: 'desc' };
        break;
      case SortingTypes.NameAsc:
        orderBy = { name: 'asc' };
        break;
      case SortingTypes.NameDesc:
        orderBy = { name: 'desc' };
        break;
      case SortingTypes.StockAsc:
        orderBy = { productStock: { quantity: 'asc' } };
        break;
      case SortingTypes.StockDesc:
        orderBy = { productStock: { quantity: 'desc' } };
        break;
      case SortingTypes.CategoryAsc:
        orderBy = { category: { name: 'asc' } };
        break;
      case SortingTypes.CategoryDesc:
        orderBy = { category: { name: 'desc' } };
        break;
    }

    const products = await this.prisma.product.findMany({
      take,
      skip,
      orderBy,
      where,
      include: {
        category: true,
        productImages: {
          select: {
            id: true,
            url: true,
            alt: true,
            position: true,
          },
        },
        productStock: {
          select: {
            id: true,
            quantity: true,
            updatedAt: true,
          },
        },
      },
    });

    const numOfProducts = await this.prisma.product.count({
      where,
    });

    return {
      products,
      total: numOfProducts,
    };
  }

  async searchCategories(query: GetCategoriesQueryDTO) {
    const { itemsPerPage, page, term } = query;

    const where: Prisma.CategoryWhereInput = {};

    if (term) {
      where.name = { contains: term, mode: 'insensitive' };
    }

    const take = parseInt(itemsPerPage) || 10;
    const skip = (parseInt(page) - 1) * take || 0;

    const categories = await this.prisma.category.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
        name: true,
        categorySizes: { select: { size: true } },
        _count: {
          select: {
            products: {
              where: {
                removedAt: null
              }
            },
          },
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      ...category,
      categorySizes: category.categorySizes.map((size) => size.size),
    }));

    const numOfCategories = await this.prisma.category.count({
      where,
    });

    return {
      categories: formattedCategories,
      total: numOfCategories,
    };
  }
}
