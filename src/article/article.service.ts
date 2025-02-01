import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { IArticlesResponse } from './types/articlesResponse.interface';
import dataSource from '@/ormconfig';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const queryBuilder = dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOneBy({ slug });
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('Вы не авторизовавны', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('Вы не авторизовавны', HttpStatus.FORBIDDEN);
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
      relations: ['favorites'],
    });

    if (!article) {
      throw new HttpException('Вы уже поставили лайк', HttpStatus.FORBIDDEN);
    }

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
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

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
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
