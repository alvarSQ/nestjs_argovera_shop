import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '@/category/category.entity';
import { BrandEntity } from '@/brand/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, BrandEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
