import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService){}

    async createProductCategory(category: ProductCategoryDTO){

        return this.prisma.category.create({
            data: {
                name: category.name,
                categorySizes: {
                    connectOrCreate: category.sizes.map(size => ({
                        where: {
                            idCategory_idSize: {
                                idCategory: category.id,
                                idSize: size.size
                            }
                         },
                         create: {
                            size: {
                                connectOrCreate: {
                                    where: { size: size.size },
                                    create: { size: size.size }
                                }
                            }
                         }
                    }))
                }
            },
            include: {
                categorySizes: { select: { 
                    size: true
                }}
            }
        })
    }

}
