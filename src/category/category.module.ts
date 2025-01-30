import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
