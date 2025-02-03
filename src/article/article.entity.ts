import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ default: 0 })
  views: number;

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
  image: string;

  @Column({ default: '' })
  seoDescription: string;

  @Column({ default: '' })
  seoKeywords: string;

  @Column({ default: '' })
  seoCanonical: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true });
  }
}
