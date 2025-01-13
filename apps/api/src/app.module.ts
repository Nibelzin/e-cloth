import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SearchModule } from './search/search.module';
import { StripeService } from './stripe/stripe.service';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist')
    }),
    UserModule,
    WebhookModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    PrismaModule,
    AddressModule,
    ProductModule,
    CategoryModule,
    SearchModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, StripeService, OrderService],
})
export class AppModule {}
