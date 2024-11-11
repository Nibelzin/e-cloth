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

  @Get(':term')
  async searchProductsByTerm(
    @Param('term') term: string,
    @Query() query: GetProductsQueryDTO,
  ) {
    try {
      return this.searchService.searchProductsByTerm(term, query);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
