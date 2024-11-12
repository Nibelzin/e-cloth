import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductsQueryDTO, SortingTypes } from './dto/search.query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.product.findMany({
      take,
      skip,
      orderBy,
      where: {
        category: { name: { equals: categoryName, mode: 'insensitive' } },
      },
    });
  }

  async searchAllProducts(query: GetProductsQueryDTO) {
    const { itemsPerPage, page, sorting, term } = query;

    const where: Prisma.ProductWhereInput = {};
    if (term) {
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { category: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

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
      where,
      include: {
        category: true,
        productImages: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
        },
      },
    });

    const numOfProducts = await this.prisma.product.count()

    return {
      products,
      total: numOfProducts
    }
  }
}
