import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';
import { IProductsResponse } from './types/productsResponse.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { IProductResponse } from './types/productResponse.interface';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';
import * as json2csv from 'json2csv';
import { CategoryEntity } from '@/category/category.entity';
import { BrandEntity } from '@/brand/brand.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: TreeRepository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async importProductsFromCSV(
    file: Express.Multer.File,
  ): Promise<ProductEntity[]> {
    const records: CreateProductDto[] = await this.parseCSV(file.buffer);

    const result: ProductEntity[] = [];

    for (const productData of records) {
      const category = await this.findOrCreateCategory(productData.category);
      const brand = await this.findOrCreateBrand(productData.brand);

      // Создаем продукт, независимо от того, существуют ли уже категория или бренд
      const product = this.productRepository.create({
        ...productData,
        categories: category,
        brands: brand,
      });
      try {
        const savedProduct = await this.productRepository.save(product);
        result.push(savedProduct);
      } catch (error) {
        console.error(
          `Failed to save product ${productData.name}:`,
          error.message,
        );
      }
    }

    return result;
  }

  private async parseCSV(buffer: Buffer): Promise<CreateProductDto[]> {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ';',
      relax_column_count: true,
      relax_quotes: true,
    });

    return new Promise((resolve, reject) => {
      const records: CreateProductDto[] = [];

      parser.on('readable', () => {
        let record: CreateProductDto;
        while ((record = parser.read()) !== null) {
          records.push({
            ...record,
          });
        }
      });

      parser.on('error', (error) => reject(error));
      parser.on('end', () => resolve(records));

      parser.write(buffer.toString());
      parser.end();
    });
  }

  private async findOrCreateCategory(categoryPath: string) {
    const categoryNames = categoryPath.split('/');
    let parentCategory: CategoryEntity | null = null;
    let currentCategory: CategoryEntity | null = null;

    for (const name of categoryNames) {
      currentCategory = await this.categoryRepository.findOne({
        where: { name, parent: parentCategory },
      });

      if (!currentCategory) {
        // Проверяем, существует ли уже категория с таким именем (без учета родителя)
        const existingCategory = await this.categoryRepository.findOneBy({
          name,
        });
        if (existingCategory) {
          console.warn(
            `Using existing category: '${name}' already exists but cannot be matched to the given path. Using as is.`,
          );
          currentCategory = existingCategory; // Используем существующую категорию
        } else {
          currentCategory = this.categoryRepository.create({
            name,
            image: '',
            parent: parentCategory,
          });
          await this.categoryRepository.save(currentCategory);
        }
      }

      parentCategory = currentCategory;
    }

    return currentCategory!;
  }

  private async findOrCreateBrand(brandName: string): Promise<BrandEntity> {
    let brand = await this.brandRepository.findOneBy({ name: brandName });
    if (brand) {
      return brand; // Возвращаем существующий бренд
    }
    brand = this.brandRepository.create({ name: brandName, image: '' });
    return await this.brandRepository.save(brand);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    // Проверяем, существует ли продукт с таким именем
    const productByProductName = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    if (productByProductName) {
      throw new HttpException(
        'Name product are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Находим или создаем категорию
    const category = await this.findOrCreateCategory(createProductDto.category);

    // Находим или создаем бренд
    const brand = await this.findOrCreateBrand(createProductDto.brand);

    // Создаем новый продукт
    const product = new ProductEntity();
    Object.assign(product, createProductDto);

    // Устанавливаем категорию и бренд
    product.categories = category;
    product.brands = brand;

    // Сохраняем продукт в базе данных
    return await this.productRepository.save(product);
  }

  //   async createProduct(
  //     createProductDto: CreateProductDto,
  //   ): Promise<ProductEntity> {
  //     const productByProductName = await this.productRepository.findOne({
  //       where: {
  //         name: createProductDto.name,
  //       },
  //     });
  //     if (productByProductName) {
  //       throw new HttpException(
  //         'Name product are taken',
  //         HttpStatus.UNPROCESSABLE_ENTITY,
  //       );
  //     }

  //     const product = new ProductEntity();
  //     Object.assign(product, createProductDto);

  //     return await this.productRepository.save(product);
  //   }

  async findAll(query: any): Promise<IProductsResponse> {
    const queryBuilder = this.productRepository.createQueryBuilder('products');

    queryBuilder
      .leftJoinAndSelect('products.categories', 'category')
      .leftJoinAndSelect('products.brands', 'brand');

    queryBuilder.orderBy('products.id', 'ASC');

    if (query.limit) queryBuilder.limit(query.limit);

    if (query.offset) queryBuilder.offset(query.offset);

    const products = await queryBuilder.getMany();

    const productsCount = await queryBuilder.getCount();

    return { products, productsCount };
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    return await this.productRepository.findOne({
      where: { slug },
      relations: ['categories', 'brands'],
    });
  }

  async updateProduct(
    slug: string,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    // Найти продукт по slug
    const existingProduct = await this.findBySlug(slug);

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    // Обновить данные продукта
    Object.assign(existingProduct, updateProductDto);
    // Обновить или создать категорию
    if (updateProductDto.category) {
      existingProduct.categories = await this.findOrCreateCategory(
        updateProductDto.category,
      );
    }
    // Обновить или создать бренд
    if (updateProductDto.brand) {
      existingProduct.brands = await this.findOrCreateBrand(
        updateProductDto.brand,
      );
    }
    // Сохранить обновленный продукт
    return await this.productRepository.save(existingProduct);
  }

  async deleteProduct(slug: string): Promise<DeleteResult> {
    const product = await this.findBySlug(slug);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return await this.productRepository.delete({ slug });
  }

  buildProductResponse(product: ProductEntity): IProductResponse {
    return { product };
  }
}
