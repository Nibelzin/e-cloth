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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO, ProductImageDTO } from './dto/product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
      console.log(error)
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

  @Delete('images')
  async deleteProductImages(@Body() imagesToRemove: ProductImageDTO[]){
    try {
      return this.productService.deleteProductImages(imagesToRemove);
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.NOT_FOUND);
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

  @Delete(':id/soft')
  async softDeleteProduct(@Param('id') productId: string){
    try {
      return await this.productService.softDeleteProduct(productId)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images'))
  async createProductImages(@UploadedFiles() images: Express.Multer.File[], @Body() body: any){
    try {
      const imagesWithId = images.map((image, index) => {
        return {
          id: JSON.parse(body.imageIds)[index],
          file: image
        }
      })

      return this.productService.createProductImages(imagesWithId, body.productId);
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
