import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import slugify from 'slugify';
import { BrandEntity } from '@/brand/brand.entity';

@Entity({ name: 'categories' })
@Tree('nested-set')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column()
  image: string;

  @Column({ default: '' })
  seoDescription: string;

  @Column({ default: '' })
  seoKeywords: string;

  @Column({ default: '' })
  seoCanonical: string;

  @OneToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];

  @OneToOne(() => ProductEntity, (brand) => brand.categories)
  brands: BrandEntity;

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  parent: CategoryEntity;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
