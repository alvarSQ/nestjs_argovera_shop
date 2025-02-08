import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ProductEntity } from '@/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity ])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}