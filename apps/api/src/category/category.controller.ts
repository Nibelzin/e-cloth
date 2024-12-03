import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ProductCategoryDTO } from './dto/category.dto';
import { SearchService } from 'src/search/search.service';
import { GetProductsQueryDTO } from 'src/search/dto/search.query.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly searchService: SearchService,
  ) {}

  @Get()
  async getCategories() {
    try {
      return await this.categoryService.getCategories();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':categoryId')
  async getCategoryById(@Param('categoryId') categoryId: string) {
    try {
      return await this.categoryService.getCategoryById(categoryId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':categoryName')
  async searchProductsByCategory(
    @Param('categoryName') categoryName: string,
    @Query() query: GetProductsQueryDTO,
  ) {
    try {
      return this.searchService.searchProductsByCategory(categoryName, query);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createCategory(@Body() category: ProductCategoryDTO) {
    try {
      return await this.categoryService.createCategory(category);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateCategory(@Body() category: ProductCategoryDTO) {
    try {
      return await this.categoryService.updateCategory(category);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string) {
    try {
      return await this.categoryService.deleteCategory(categoryId);
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
