import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';
import { UserEntity } from '@/user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const queryBuilder = this.articleRepository.createQueryBuilder('articles');

    if (query.favorited && currentUserId) {
      const user = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favoritesArticle'],
      });

      if (user) {
        const ids = user.favoritesArticle.map((el) => el.id);

        if (ids.length > 0) {
          queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
        } else {
          queryBuilder.andWhere('FALSE');
        }
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.limit) queryBuilder.limit(query.limit);

    if (query.offset) queryBuilder.offset(query.offset);

    let favoriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favoritesArticle'],
      });
      favoriteIds = currentUser.favoritesArticle.map((favorite) => favorite.id);
    }

    const articlesCount = await queryBuilder.getCount();
    const articles = await queryBuilder.getMany();

    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const articleByArticleTitle = await this.articleRepository.findOne({
      where: {
        name: createArticleDto.name,
      },
    });
    if (articleByArticleTitle) {
      throw new HttpException(
        'Title article are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOneBy({ slug });
  }

  async deleteArticle(slug: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favoritesArticle'],
    });

    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }

    const isNotFavorited =
      user.favoritesArticle.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favoritesArticle.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favoritesArticle'],
    });

    const articleIndex = user.favoritesArticle.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favoritesArticle.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }
}
