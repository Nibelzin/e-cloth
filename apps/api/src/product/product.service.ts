import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDTO, ProductImageDTO } from './dto/product.dto';
import { Product, Prisma } from '@prisma/client';
import { GetProductsQueryDTO, SortingTypes } from './dto/product.query.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query?: GetProductsQueryDTO, category?: string) {
    const { search, itemsPerPage, page, sorting } = query;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = { name: { contains: category, mode: 'insensitive' } };
    }

    if (search) {
      if (category) {
        where.name = { contains: search, mode: 'insensitive' };
      } else {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sorting === SortingTypes.PriceDesc) {
      orderBy = { price: 'desc' };
    } else if (sorting === SortingTypes.PriceAsc) {
      orderBy = { price: 'asc' };
    }

    const take = itemsPerPage ? parseInt(itemsPerPage) : 2;
    const skip = page ? (parseInt(page) - 1) * take : 0;

    return this.prisma.product.findMany({
      where,
      take,
      skip,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        category: { select: { name: true } },
        price: true,
        promotion_price: true,
      },
    });
  }

  async createProduct(product: ProductDTO) {
    const { productImages } = product;

    return this.prisma.product.create({
      data: {
        description: product.description,
        name: product.name,
        price: product.price,
        idCategory: product.idCategory,
        productImages: {
          create: productImages.map((image: ProductImageDTO) => ({
            url: image.url,
            alt: image.alt,
          })),
        },
      },
      include: {
        productImages: true,
        category: true,
      },
    });
  }

  async updateProduct(updatedProduct: ProductDTO) {
    const { productImages } = updatedProduct;

    return this.prisma.product.update({
      where: { id: updatedProduct.id },
      data: {
        description: updatedProduct.description,
        name: updatedProduct.name,
        price: updatedProduct.price,
        idCategory: updatedProduct.idCategory,
        productImages: {
          connectOrCreate: productImages.map((image: ProductImageDTO) => ({
            where: { id: image.id },
            create: {
              url: image.url,
              alt: image.alt,
            },
          })),
        },
      },
    });
  }
}
