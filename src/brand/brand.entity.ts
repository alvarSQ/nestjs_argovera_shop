import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import slugify from 'slugify';
import { CategoryEntity } from '@/category/category.entity';

@Entity({ name: 'brands' })
export class BrandEntity {
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

  @OneToMany(() => ProductEntity, (product) => product.brands)
  products: ProductEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.brands)
  categories: CategoryEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
