import { ArticleEntity } from '@/article/article.entity';
import { ProductEntity } from '@/product/product.entity';
import { hash } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  favoritesProduct: ProductEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favoritesArticle: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
