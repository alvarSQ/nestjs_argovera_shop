import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';
import { DeleteResult, Repository } from 'typeorm';
import dataSource from '@/dataSource';
import { IBrandsResponse } from './types/brandsResponse.interface';
import { CreateBrandDto } from './dto/createBrand.dto';
import { IBrandResponse } from './types/brandResponse.interface';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async findAll(query: any): Promise<IBrandsResponse> {
    const queryBuilder = dataSource
      .getRepository(BrandEntity)
      .createQueryBuilder('brands');

    queryBuilder.orderBy('brands.name', 'ASC');

    if (query.limit) queryBuilder.limit(query.limit);

    if (query.offset) queryBuilder.offset(query.offset);

    const brandsCount = await queryBuilder.getCount();
    const brands = await queryBuilder.getMany();

    return { brands, brandsCount };
  }

  async createBrand(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    const brandBybrandName = await this.brandRepository.findOne({
      where: {
        name: createBrandDto.name,
      },
    });
    if (brandBybrandName) {
      throw new HttpException(
        'Name brand are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const brand = new BrandEntity();
    Object.assign(brand, createBrandDto);

    return await this.brandRepository.save(brand);
  }

  async findBySlug(slug: string): Promise<BrandEntity> {
    return await this.brandRepository.findOneBy({ slug });
  }

  async deleteBrand(
    slug: string
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    // if (article.author.id !== currentUserId) {
    //   throw new HttpException('Вы не авторизовавны', HttpStatus.FORBIDDEN);
    // }
    return await this.brandRepository.delete({ slug });
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

  buildBrandResponse(brand: BrandEntity): IBrandResponse {
    return { brand };
  }
}
