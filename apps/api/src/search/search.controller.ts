import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { GetProductsQueryDTO } from './dto/search.query.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchAllProducts(@Query() query: GetProductsQueryDTO) {
    try {
      return this.searchService.searchAllProducts(query);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':category')
  async searchProductsByCategory(@Param('category') categoryName: string, @Query() query: GetProductsQueryDTO) {
    try {
      return this.searchService.searchProductsByCategory(categoryName, query);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('category')
  async searchCategories(@Query() query: GetProductsQueryDTO) {
    try {
      return this.searchService.searchCategories(query);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
