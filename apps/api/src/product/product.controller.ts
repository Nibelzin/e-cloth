import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dto/product.dto';
import { GetProductsQueryDTO } from './dto/product.query.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    try {
      return await this.productService.getProducts();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('search')
  async getFilteredProducts(@Query() query: GetProductsQueryDTO){
    return this.productService.getProducts(query)
  }

  @Get('search/:category')
  async getFilteredProductsByCategory(@Param('category') category: string, @Query() query: GetProductsQueryDTO) {
    return this.productService.getProducts(query, category);
  }

  @Post()
  async createProduct(@Body() product: ProductDTO) {
    try {
      return await this.productService.createProduct(product);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
