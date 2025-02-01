import { UserEntity } from '@/user/user.entity';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true })
    + '-' +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  @ManyToOne(() => UserEntity, (user) => user.articles, {eager: true})
  author: UserEntity;
}
