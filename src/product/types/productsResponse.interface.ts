import { ProductType } from './product.type';

export interface IProductsResponse {
  products: ProductType[];
  productsCount: number;
}
