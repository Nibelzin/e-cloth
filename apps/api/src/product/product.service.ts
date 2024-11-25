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
        promotionPrice: true,
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
        promotionPrice: true,
        productImages: true,
        productStock: true,
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
        promotionPrice: product.promotionPrice,
        idCategory: product.idCategory,
        productStock: {
          create: productStock,
        },
        productImages: {
          createMany: {
            data: productImages.map((image: ProductImageDTO, index: number) => {
              return {
                  id: image.id,
                  url: image.url,
                  alt: image.alt,
                  position: index,
              };
            }),
          },
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
    if (!updatedProduct || !updatedProduct.productImages) {
      throw new Error('Invalid product data');
    }

    const { productImages } = updatedProduct;

    const productCurrentImages = await this.prisma.productImage.findMany({
      where: { productId: updatedProduct.id },
    });

    const imagesToRemove = productCurrentImages.filter((currentImage) => {
      return !productImages.some((newImage) => newImage.id === currentImage.id);
    });

    const product = await this.prisma.product.update({
      where: { id: updatedProduct.id },
      data: {
        description: updatedProduct.description,
        name: updatedProduct.name,
        price: updatedProduct.price,
        promotionPrice: updatedProduct.promotionPrice,
        idCategory: updatedProduct.idCategory,
        productImages: {
          connectOrCreate: productImages.map(
            (image: ProductImageDTO, index: number) => ({
              where: { id: image.id },
              create: {
                id: image.id,
                url: image.url,
                alt: image.alt,
                position: index,
              },
            }),
          ),
          updateMany: productImages.map(
            (image: ProductImageDTO, index: number) => ({
              where: { id: image.id },
              data: {
                position: index,
              },
            }),
          ),
          deleteMany: imagesToRemove.map((image) => ({
            id: image.id,
          })),
        },
        productStock: {
          update: updatedProduct.productStock,
        }
      },
    });

    const updatedProductAndImagesToRemove = {
      product,
      imagesToRemove,
    };

    return updatedProductAndImagesToRemove;
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

    const imagesToUpload = imagesWithId.filter(
      (image) => !existingImageIds.includes(image.id),
    );

    const restOfTheImages = imagesWithId.filter((image) =>
      existingImageIds.includes(image.id),
    );

    await restOfTheImages.map(async (image) => {
      fs.unlinkSync(image.file.path);
    });

    const uploadedImages = imagesToUpload.map(async (image) => {
      const imageExt = image.file.originalname.split('.').pop();
      const imagePath = `${image.id}.${imageExt}`;

      console.log(imagePath);

      const { error } = await this.supabase.storage
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
      } = await this.supabase.storage
        .from('product_images')
        .getPublicUrl(`${productId}/${imagePath}`);

      fs.unlinkSync(image.file.path);

      return {
        id: image.id,
        url: publicUrl,
        alt: image.file.originalname,
      };
    });

    return Promise.all(uploadedImages);
  }

  async deleteProductImages(imagesToRemove: ProductImageDTO[]) {
    if (imagesToRemove.length === 0) {
      return { message: 'Sem imagens para deletar', status: 'success' };
    }

    const deletedImages = imagesToRemove.map(async (image) => {
      const imageExt = image.alt.split('.').pop();
      const imagePath = `${image.id}.${imageExt}`;

      const { error } = await this.supabase.storage
        .from('product_images')
        .remove([`${image.productId}/${imagePath}`]);

      if (error) {
        throw new Error(`Failed to delete image: ${imagePath}`);
      }

      return { id: image.id, status: 'deleted' };
    });

    return Promise.all(deletedImages);
  }
}
