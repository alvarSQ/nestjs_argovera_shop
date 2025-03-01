import { AppEntity } from '@/app.entity';
import { BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity extends AppEntity {
  @Column({ default: '' })
  body: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  visibility: boolean;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
