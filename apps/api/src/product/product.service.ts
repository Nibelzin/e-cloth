import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDTO, ProductImageDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        promotion_price: true,
      },
    });
  }

  async getProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
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

  async deleteProduct(productId: string) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.productImage.deleteMany({
        where: { productId: productId },
      });

      return prisma.product.delete({
        where: { id: productId },
      });
    });
  }
}
