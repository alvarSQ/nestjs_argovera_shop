import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { CreateArticleDto } from './dto/createArticle.dto';
import { User } from '@/user/decorators/user.decorator';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AdminGuard)
  async deleteArticle(@Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug);
  }

  @Put(':slug')
  @UseGuards(AdminGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
