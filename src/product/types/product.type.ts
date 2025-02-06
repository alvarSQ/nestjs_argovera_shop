import { ProductEntity } from '../product.entity';

export type ProductType = Omit<ProductEntity, 'generateSlug'>;
