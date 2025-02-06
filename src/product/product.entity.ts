import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate
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

  @Column({ default: '' })
  description: string;

  @Column()
  price: number;

  @Column()
  slug: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  scores: number | null;

  @Column({ default: 0 })
  code: number;

  @Column({ default: 15 })
  discountPercentage: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  voices: number;

  @Column({ default: 0 })
  views: number;

  @Column({
    default: 0.1,
    type: 'numeric',
  })
  weigh: number;

  @Column({
    default: '',
    type: 'simple-array',
  })
  reviews: string[];

  @Column({ default: true })
  visibility: boolean;

  @Column({ default: false })
  favorites: boolean;

  @Column({ default: '' })
  seoDescription: string;

  @Column({ default: '' })
  seoKeywords: string;

  @Column({ default: '' })
  seoCanonical: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  categories: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brands: BrandEntity;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
