import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  Tree,
  JoinTable,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import slugify from 'slugify';
import { BrandEntity } from '@/brand/brand.entity';

@Entity({ name: 'categories' })
@Tree('materialized-path')
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

  @ManyToMany(() => BrandEntity, (brand) => brand.categories)
  @JoinTable()
  brands: BrandEntity[];

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  parent: CategoryEntity | null;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
