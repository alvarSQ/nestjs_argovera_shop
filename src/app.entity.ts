import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class AppEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '' })
  image: string;

  @Column({ default: '' })
  seoDescription: string;

  @Column({ default: '' })
  seoKeywords: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
