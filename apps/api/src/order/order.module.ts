import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from 'src/product/product.module';

@Module({
    providers: [OrderService],
    imports: [PrismaModule, ProductModule],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule {}
