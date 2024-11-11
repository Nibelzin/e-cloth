import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [PrismaModule, SearchModule]
})
export class CategoryModule {}
