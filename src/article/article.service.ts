import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { IArticlesResponse } from './types/articlesResponse.interface';
import dataSource from '@/dataSource';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(query: any): Promise<IArticlesResponse> {
    const queryBuilder = dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles');
    
    
     queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();    
    
    

    return { articles, articlesCount };
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {

    const articleByArticleTitle = await this.articleRepository.findOne({
      where: {
        title: createArticleDto.title,
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

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    // if (article.author.id !== currentUserId) {
    //   throw new HttpException('Вы не авторизовавны', HttpStatus.FORBIDDEN);
    // }
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
    // if (article.author.id !== currentUserId) {
    //   throw new HttpException('Вы не авторизовавны', HttpStatus.FORBIDDEN);
    // }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  // async addArticleToFavorites(
  //   slug: string,
  //   currentUserId: number,
  // ): Promise<ArticleEntity> {
  //   const article = await this.findBySlug(slug);

  //   const user = await this.userRepository.findOne({
  //     where: { id: currentUserId },
  //     relations: ['favorites'],
  //   });

  //   if (!article) {
  //     throw new HttpException('Вы уже поставили лайк', HttpStatus.FORBIDDEN);
  //   }

  //   const isNotFavorited =
  //     user.favorites.findIndex(
  //       (articleInFavorites) => articleInFavorites.id === article.id,
  //     ) === -1;

  //   if (isNotFavorited) {
  //     user.favorites.push(article);
  //     article.favoritesCount++;
  //     await this.userRepository.save(user);
  //     await this.articleRepository.save(article);
  //   }

  //   return article;
  // }

  // async deleteArticleFromFavorites(
  //   slug: string,
  //   currentUserId: number,
  // ): Promise<ArticleEntity> {
  //   const article = await this.findBySlug(slug);

  //   const user = await this.userRepository.findOne({
  //     where: { id: currentUserId },
  //     relations: ['favorites'],
  //   });

  //   const articleIndex = user.favorites.findIndex(
  //     (articleInFavorites) => articleInFavorites.id === article.id,
  //   );

  //   if (articleIndex >= 0) {
  //     user.favorites.splice(articleIndex, 1);
  //     article.favoritesCount--;
  //     await this.userRepository.save(user);
  //     await this.articleRepository.save(article);
  //   }

  //   return article;
  // }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }
}
