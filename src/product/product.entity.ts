import { Entity, Column, ManyToOne } from 'typeorm';
import { CategoryEntity } from '@/category/category.entity';
import { BrandEntity } from '@/brand/brand.entity';
import { AppEntity } from '@/app.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AppEntity {
  @Column()
  price: number;

  @Column({ default: 0 })
  scores: number;

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

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  categories: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brands: BrandEntity;
}
