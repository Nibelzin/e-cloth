import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDTO, ProductImageDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async createProduct(product: ProductDTO){
        const { productImages } = product


        return this.prisma.product.create({
            data: {
                description: product.description,
                name: product.name,
                price: product.price,
                idCategory: product.idCategory,
                productImages: {
                    create: productImages.map((image: ProductImageDTO) => ({
                        url: image.url,
                        alt: image.alt
                    }))
                }
            },
            include: {
                productImages: true,
                category: true
            }
        })
    }


}
