import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { IBrandsResponse } from './types/brandsResponse.interface';
import { IBrandResponse } from './types/brandResponse.interface';
import { CreateBrandDto } from './dto/createBrand.dto';
import { BrandEntity } from './brand.entity';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import json2csv from 'json2csv';
import { IProductInBrandResponse } from './types/productInBrandResponse.interface';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async importCategoriesFromCSV(@UploadedFile() file: Express.Multer.File) {
    return this.brandService.importBrandsFromCSV(file);
  }

  @Get('export')
  async exportBrandsToCSV(@Res() res: Response) {
    return this.brandService.jsonToCsv(res);
  }

  @Get()
  async findAll(@Query() query: any): Promise<IBrandsResponse> {
    return await this.brandService.findAll(query);
  }

  @Post()
  async create(
    @Body('brand') createBrandDto: CreateBrandDto,
  ): Promise<IBrandResponse> {
    const brand = await this.brandService.createBrand(createBrandDto);
    return this.brandService.buildBrandResponse(brand);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<IProductInBrandResponse> {
    return await this.brandService.findBySlug(slug);
  }

  @Delete(':slug')
  async deleteBrand(@Param('slug') slug: string) {
    return await this.brandService.deleteBrand(slug);
  }
}
