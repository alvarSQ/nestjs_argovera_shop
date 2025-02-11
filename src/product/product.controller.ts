import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IProductsResponse } from './types/productsResponse.interface';
import { IProductResponse } from './types/productResponse.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('import')
  @UseGuards(AdminGuard)
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
  @UseGuards(AdminGuard)
  async create(
    @Body('product') createProductDto: CreateProductDto,
  ): Promise<IProductResponse> {
    const product = await this.productService.createProduct(createProductDto);
    return this.productService.buildProductResponse(product);
  }

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IProductsResponse> {
    return await this.productService.findAll(currentUserId, query);
  }

  @Get(':slug')
  async getSingleProduct(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IProductResponse> {
    const product = await this.productService.findBySlug(slug, currentUserId);
    return this.productService.buildProductResponse(product);
  }

  @Delete(':slug')
  @UseGuards(AdminGuard)
  async deleteProduct(@Param('slug') slug: string) {
    return await this.productService.deleteProduct(slug);
  }

  @Put(':slug')
  @UseGuards(AdminGuard)
  async updateProduct(
    @Param('slug') slug: string,
    @Body('product') updateProductDto: UpdateProductDto,
  ): Promise<IProductResponse> {
    const product = await this.productService.updateProduct(
      slug,
      updateProductDto,
    );
    return this.productService.buildProductResponse(product);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addProductToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IProductResponse> {
    const product = await this.productService.addProductToFavorites(
      slug,
      currentUserId,
    );
    return this.productService.buildProductResponse(product);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteProductFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IProductResponse> {
    const product = await this.productService.deleteProductFromFavorites(
      slug,
      currentUserId,
    );
    return this.productService.buildProductResponse(product);
  }
}
