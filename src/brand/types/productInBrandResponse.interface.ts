import { ProductEntity } from '@/product/product.entity';
import { BrandEntity } from '../brand.entity';

export interface IProductInBrandResponse {
  brand: BrandEntity;
  products: ProductEntity[];
}
