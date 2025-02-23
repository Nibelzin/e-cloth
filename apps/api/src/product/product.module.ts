import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [ProductService],
  imports: [PrismaModule, MulterModule.register({
    dest: './uploads',
  })],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
