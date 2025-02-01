import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CategoryEntity } from '@/category/category.entity';
import slugify from 'slugify';
import { BrandEntity } from '@/brand/brand.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  slug: string;

  @Column()
  scores: number;

  @Column()
  discountPercentage: number;

  @Column()
  rating: number;

  @Column()
  voices: number;

  @Column()
  views: number;

  @Column()
  weigh: number;

  @Column('simple-array')
  reviews: string[];

  @Column()
  visibility: boolean;

  @Column()
  favorites: boolean;

  @Column()
  image: string;

  @Column()
  seoDescription: number;

  @Column()
  seoKeywords: string;

  @Column()
  seoCanonical: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brand: BrandEntity;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
    //     + '-' +
    //   ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
}
