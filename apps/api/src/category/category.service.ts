import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategoryById(categoryId: string) {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        categorySizes: { select: { size: true } },
      }
    })
  }

  async getCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        categorySizes: { select: { size: true } },
        _count: {
          select: {
            products: true,
          },
        }
      },
    });
  }

  async createCategory(category: ProductCategoryDTO) {
    return this.prisma.category.create({
      data: {
        name: category.name,
        categorySizes: {
          connectOrCreate: category.categorySizes.map((size) => ({
            where: {
              idCategory_idSize: {
                idCategory: category.id,
                idSize: size.size,
              },
            },
            create: {
              size: {
                connectOrCreate: {
                  where: { size: size.size },
                  create: { size: size.size },
                },
              },
            },
          })),
        },
      },
      include: {
        categorySizes: {
          select: {
            size: true,
          },
        },
      },
    });
  }

  async updateCategory(category: ProductCategoryDTO) {
    return this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        categorySizes: {
          deleteMany: {
            idCategory: category.id
          },
          connectOrCreate: category.categorySizes.map((size) => ({
            where: {
              idCategory_idSize: {
                idCategory: category.id,
                idSize: size.size,
              },
            },
            create: {
              size: {
                connectOrCreate: {
                  where: { size: size.size },
                  create: { size: size.size },
                },
              },
            },
          })),
        },
      }
    })
  }
}
