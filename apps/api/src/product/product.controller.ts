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
import { ProductService } from './product.service';
import { ProductDTO } from './dto/product.dto';

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

  @Get(':id')
  async getProductById(@Param('id') productId: string){
    try {
      return await this.productService.getProductById(productId)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createProduct(@Body() product: ProductDTO) {
    try {
      return await this.productService.createProduct(product);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateProduct(@Body() updatedProduct: ProductDTO) {
    try {
      return await this.productService.updateProduct(updatedProduct);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string){
    try {
      return await this.productService.deleteProduct(productId)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
