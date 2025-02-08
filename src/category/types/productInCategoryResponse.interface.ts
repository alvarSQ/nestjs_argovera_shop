import { ProductEntity } from '@/product/product.entity';
import { CategoryEntity } from '../category.entity';

export interface IProductInCategoryResponse {
  category: CategoryEntity;
  products: ProductEntity[];
}
