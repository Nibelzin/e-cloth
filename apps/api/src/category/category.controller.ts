import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ProductCategoryDTO } from './dto/category.dto';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService){}

    @Post()
    async createProductCategory(@Body() category: ProductCategoryDTO) {
      try {
        return await this.categoryService.createProductCategory(category);
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
}
