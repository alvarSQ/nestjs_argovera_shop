import { Entity, OneToMany, Tree, TreeParent, TreeChildren } from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import { AppEntity } from '@/app.entity';

@Entity({ name: 'categories' })
@Tree('materialized-path')
export class CategoryEntity extends AppEntity {
  @OneToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  parent: CategoryEntity | null;
}
