import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { DeleteResult, Repository, TreeRepository } from 'typeorm';
import { IProductsResponse } from './types/productsResponse.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { IProductResponse } from './types/productResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { parse } from 'csv-parse';
import { CategoryEntity } from '@/category/category.entity';
import { BrandEntity } from '@/brand/brand.entity';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UserEntity } from '@/user/user.entity';
import { Parser } from 'json2csv';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: TreeRepository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async importProductsFromCSV(
    file: Express.Multer.File,
  ): Promise<ProductEntity[]> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File or file buffer is missing');
    }

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

  async csvToProducts(res: Response) {
    const products = await this.productRepository.find({
      relations: ['categories', 'brands'],
    });

    // Преобразуем каждый продукт, включая обработку связей
    const productsForExport = products.map((product) => ({
      ...product,
      category: product.categories ? product.categories.name : '',
      brand: product.brands ? product.brands.name : '',
    }));

    // Получаем все ключи из первого элемента массива для определения полей CSV
    const fields = Object.keys(productsForExport[0]);

    // Создаем парсер и преобразуем данные в CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(productsForExport);

    res.set('Content-Type', 'text/csv');
    res.set(
      'Content-Disposition',
      `attachment; filename="products_${Date.now()}.csv"`,
    );
    res.send(csv);
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

  async findAll(currentUserId: number, query: any): Promise<IProductsResponse> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'category')
      .leftJoinAndSelect('products.brands', 'brand');

    let favoriteIds: number[] = [];

    // Если запрашиваются избранные товары
    if (query.f) {
      // Находим текущего пользователя
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
      });

      // Находим пользователя, чьи избранные товары запрашиваются
      const favoritedUser = await this.userRepository.findOne({
        where: { username: query.f },
        relations: ['favoritesProduct'],
      });

      // Если пользователь не найден
      if (!favoritedUser) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Если запрашиваются избранные товары другого пользователя
      if (favoritedUser.id !== currentUser.id) {
        throw new ForbiddenException(
          'Вы можете запрашивать только свои избранные товары',
        );
      }

      // Получаем идентификаторы избранных товаров
      favoriteIds = favoritedUser.favoritesProduct.map((el) => el.id);

      // Фильтруем товары по избранным
      if (favoriteIds.length > 0) {
        queryBuilder.andWhere('products.id IN (:...ids)', { ids: favoriteIds });
      } else {
        queryBuilder.andWhere('FALSE'); // Если у пользователя нет избранных товаров
      }
    }

    // Добавляем пагинацию и сортировку
    queryBuilder.orderBy('products.id', 'ASC');
    if (query.limit) queryBuilder.limit(query.limit);
    if (query.offset) queryBuilder.offset(query.offset);

    // Если запрашиваются избранные товары текущего пользователя
    if (currentUserId && !query.f) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favoritesProduct'],
      });
      favoriteIds = currentUser.favoritesProduct.map((favorite) => favorite.id);
    }

    // Выполняем запрос
    const products = await queryBuilder.getMany();
    const productsCount = await queryBuilder.getCount();

    // Добавляем поле favorited к каждому товару
    const productsWithFavorited = products.map((product) => {
      const favorited = favoriteIds.includes(product.id);
      return { ...product, favorited };
    });

    return { products: productsWithFavorited, productsCount };
  }

  async findBySlug(
    slug: string,
    currentUserId: number = 0,
  ): Promise<ProductEntity & { favorited: boolean }> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['categories', 'brands'],
    });

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
    }

    let favorited = false;
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favoritesProduct'],
      });
      favorited = currentUser.favoritesProduct.some(
        (favorite) => favorite.slug === slug,
      );
    }

    // Возвращаем продукт с статусом избранного
    const productWithFavorited = Object.assign(new ProductEntity(), {
      ...product,
      favorited,
    });

    return productWithFavorited;
  }

  async updateProduct(
    slug: string,
    updateProductDto: UpdateProductDto,
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

  async addProductToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ProductEntity> {
    const product = await this.findBySlug(slug, currentUserId);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favoritesProduct'],
    });

    if (!product) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    const isNotFavorited =
      user.favoritesProduct.findIndex(
        (productInFavorites) => productInFavorites.id === product.id,
      ) === -1;

    if (isNotFavorited) {
      user.favoritesProduct.push(product);
      product.favoritesCount++;
      await this.userRepository.save(user);
      await this.productRepository.save(product);
    }

    // Обновляем статус "favorited" для продукта
    product.favorited = true;

    return product;
  }

  async deleteProductFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ProductEntity> {
    const product = await this.findBySlug(slug, currentUserId);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favoritesProduct'],
    });

    const productIndex = user.favoritesProduct.findIndex(
      (productInFavorites) => productInFavorites.id === product.id,
    );

    if (productIndex >= 0) {
      user.favoritesProduct.splice(productIndex, 1);
      product.favoritesCount--;
      await this.userRepository.save(user);
      await this.productRepository.save(product);
    }

    // Обновляем статус "favorited" для продукта
    product.favorited = false;

    return product;
  }

  async searchProducts(
    q: any,
    query: any,
  ): Promise<{ products: ProductEntity[]; productsCount: number }> {
    if (!q) {
      throw new BadRequestException('Query parameter is required');
    }

    // Создаем QueryBuilder
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category') // Джойн с категориями
      .leftJoinAndSelect('product.brands', 'brand') // Джойн с брендами
      .where('product.name LIKE :q', { q: `%${q}%` }) // Поиск по name
      .orWhere('product.description LIKE :q', { q: `%${q}%` }); // Поиск по description

    // Добавляем пагинацию
    if (query.limit) queryBuilder.limit(query.limit); // Лимит
    if (query.offset) queryBuilder.offset(query.offset); // Смещение

    // Добавляем сортировку
    const allowedSortFields = ['name', 'price', 'id'];
    if (query.sortBy && !allowedSortFields.includes(query.sortBy)) {
      throw new BadRequestException(`Invalid sortBy field: ${query.sortBy}`);
    }

    if (
      query.sortOrder &&
      !['ASC', 'DESC'].includes(query.sortOrder.toUpperCase())
    ) {
      throw new BadRequestException(`Invalid sortOrder: ${query.sortOrder}`);
    }

    if (query.sortBy && query.sortOrder) {
      queryBuilder.orderBy(`product.${query.sortBy}`, query.sortOrder); // Сортировка по полю и направлению
    } else {
      queryBuilder.orderBy('product.id', 'ASC'); // Сортировка по умолчанию
    }

    // Выполняем запрос
    const products = await queryBuilder.getMany(); // Получаем продукты
    const productsCount = await queryBuilder.getCount(); // Получаем общее количество

    // Возвращаем результат
    return { products, productsCount };
  }

  buildProductResponse(product: ProductEntity): IProductResponse {
    return { product };
  }
}
