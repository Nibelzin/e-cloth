import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProductDTO,
  ProductImageDTO,
  ProductPreviewImageDTO,
} from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  private supabase: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get('SUPABASE_URL');
    const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

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
    const { productStock, productImages } = product;

    return this.prisma.product.create({
      data: {
        id: product.id,
        description: product.description,
        name: product.name,
        price: product.price,
        idCategory: product.idCategory,
        productStock: {
          create: productStock,
        },
        productImages: {
          connectOrCreate: productImages.map((image: ProductImageDTO) => {
            return {
              where: { id: image.id },
              create: {
                id: image.id,
                url: image.url,
                alt: image.alt,
              },
            };
          }),
        },
      },
      include: {
        productImages: true,
        category: true,
        productStock: true,
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
        where: { productId },
      });

      await prisma.productStock.delete({
        where: { productId },
      });

      return prisma.product.delete({
        where: { id: productId },
      });
    });
  }

  async createProductImages(
    imagesWithId: ProductPreviewImageDTO[],
    productId: string,
  ) {
    const existingImages = await this.prisma.productImage.findMany({
      where: {
        id: {
          in: imagesWithId.map((image) => image.id),
        },
      },
    });

    const existingImageIds = existingImages.map((image) => image.id);
    const newImages = imagesWithId.filter(
      (image) => !existingImageIds.includes(image.id),
    );

    const uploadedImages = [];

    for (const image of newImages) {
      const imageExt = image.file.originalname.split('.').pop();
      const imagePath = `${image.id}.${imageExt}`;

      const { data, error } = await this.supabase.storage
        .from('product_images')
        .upload(
          `${productId}/${imagePath}`,
          fs.createReadStream(image.file.path),
          {
            cacheControl: '3600',
            upsert: false,
            duplex: 'half',
          },
        );

      if (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      const {
        data: { publicUrl },
      } = this.supabase.storage
        .from('product_images')
        .getPublicUrl(`${productId}/${imagePath}`);

      uploadedImages.push({
        id: image.id,
        url: publicUrl,
        alt: image.file.originalname,
      });

      fs.unlinkSync(image.file.path);
    }

    return uploadedImages;
  }
}
