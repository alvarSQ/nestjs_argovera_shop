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
import { IProductsResponse } from './types/productsResponse.interface';
import { IProductResponse } from './types/productResponse.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { User } from '@/user/decorators/user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async importProductsFromCSV(@UploadedFile() file: Express.Multer.File) {
    return this.productService.importProductsFromCSV(file);
  }

  //   @Get('export')
  //   async exportProductsToCSV(@Res() res: Response) {
  //     return this.productService.jsonToCsv(res);
  //   }

  @Post()
  async create(
    @Body('product') createProductDto: CreateProductDto,
  ): Promise<IProductResponse> {
    const product = await this.productService.createProduct(createProductDto);
    return this.productService.buildProductResponse(product);
  }

  @Get()
  async findAll(@Query() query: any): Promise<IProductsResponse> {
    return await this.productService.findAll(query);
  }

  @Get(':slug')
  async getSingleProduct(
    @Param('slug') slug: string,
  ): Promise<IProductResponse> {
    const product = await this.productService.findBySlug(slug);
    return this.productService.buildProductResponse(product);
  }

  @Delete(':slug')
  async deleteProduct(@Param('slug') slug: string) {
    return await this.productService.deleteProduct(slug);
  }

  @Put(':slug')
  async updateProduct(
    @Param('slug') slug: string,
    @Body('product') updateProductDto: UpdateProductDto,
  ): Promise<IProductResponse> {
    const product = await this.productService.updateProduct(
      slug,
      updateProductDto
    );
    return this.productService.buildProductResponse(product);
  }
}
