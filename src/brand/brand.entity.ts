import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProductEntity } from '@/product/product.entity';
import slugify from 'slugify';

@Entity({ name: 'brands' })
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column()
  image: string;

  @Column()
  seoDescription: number;

  @Column()
  seoKeywords: string;

  @Column()
  seoCanonical: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
    //     + '-' +
    //   ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
}
