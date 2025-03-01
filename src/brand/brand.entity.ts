import { Entity, OneToMany } from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import { AppEntity } from '@/app.entity';
@Entity({ name: 'brands' })
export class BrandEntity extends AppEntity {
  @OneToMany(() => ProductEntity, (product) => product.brands)
  products: ProductEntity[];
}
