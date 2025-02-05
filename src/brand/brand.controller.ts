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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { IBrandsResponse } from './types/brandsResponse.interface';
import { IBrandResponse } from './types/brandResponse.interface';
import { CreateBrandDto } from './dto/createBrand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly articleService: BrandService) {}

  @Get()
  async findAll(@Query() query: any): Promise<IBrandsResponse> {
    return await this.articleService.findAll(query);
  }

  @Post()
  async create(
    @Body('brand') createBrandDto: CreateBrandDto,
  ): Promise<IBrandResponse> {
    const brand = await this.articleService.createBrand(createBrandDto);
    return this.articleService.buildBrandResponse(brand);
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<IBrandResponse> {
    const brand = await this.articleService.findBySlug(slug);
    return this.articleService.buildBrandResponse(brand);
  }

  @Delete(':slug')
  async deleteBrand(@Param('slug') slug: string) {
    return await this.articleService.deleteBrand(slug);
  }
}
