import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { TreeRepository } from 'typeorm';
import { ICategoriesResponse } from './types/categoriesResponse.interface';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { ICategoryResponse } from './types/categoryResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: TreeRepository<CategoryEntity>,
  ) {}

  async importCategoriesFromCSV(
    file: Express.Multer.File,
  ): Promise<{ message: string; result: CategoryEntity[] }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File or file buffer is missing');
    }

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ';',
      relax_column_count: true,
      relax_quotes: true,
    });

    return new Promise((resolve, reject) => {
      const results: CreateCategoryDto[] = [];
      parser.on('readable', () => {
        let record: { name: string; image: string; parentId: number };
        while ((record = parser.read()) !== null) {
          // Проверка на наличие полей
          if (!record.name || !record.image) {
            console.warn('CSV record missing required fields:', record);
            continue; // Пропускаем запись, если у нее нет обязательных полей
          }
          results.push({
            name: record.name,
            image: record.image,
            parent: record.parentId,
          });
        }
      });
      parser.on('error', (error) => {
        console.error('CSV Parsing Error:', error);
        reject(new BadRequestException('Invalid CSV file'));
      });
      parser.on('end', async () => {
        try {
          const importedCategories = await this.importCategories(results);
          resolve({ message: 'Import successful', result: importedCategories });
        } catch (error) {
          reject(error);
        }
      });
      parser.write(file.buffer);
      parser.end();
    });
  }

  async importCategories(
    records: CreateCategoryDto[],
  ): Promise<CategoryEntity[]> {
    const categories: CategoryEntity[] = [];

    for (const record of records) {
      let parent: CategoryEntity | null = null;
      if (record.parent) {
        parent = await this.categoryRepository.findOneBy({
          id: record.parent,
        });
        if (!parent) {
          throw new Error(`Parent category with id ${record.parent} not found`);
        }
      }

      const category = this.categoryRepository.create({
        name: record.name,
        image: record.image,
        parent: parent,
      });

      const savedCategory = await this.categoryRepository.save(category);
      categories.push(savedCategory);
    }

    return categories;
  }

  async exportCategories(): Promise<CreateCategoryDto[]> {
    const categories = await this.categoryRepository.find({
      relations: ['parent'], // Загрузите родителя, если это нужно для экспорта
    });

    return categories.map((category) => ({
      name: category.name,
      image: category.image,
      parentId: category.parent ? category.parent.id : undefined,
    }));
  }

  async findAll(query: any): Promise<ICategoriesResponse> {
    const queryBuilder =
      this.categoryRepository.createQueryBuilder('categorys');

    queryBuilder.orderBy('categorys.id', 'ASC');

    if (query.limit) queryBuilder.limit(query.limit);

    if (query.offset) queryBuilder.offset(query.offset);

    const categorys = await queryBuilder.getMany();

    const categorysCount = await queryBuilder.getCount();

    return { categorys, categorysCount };
  }

  async findTree(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findTrees();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const categoryByCategoryName = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (categoryByCategoryName) {
      throw new HttpException(
        'Name category are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const category = new CategoryEntity();
    Object.assign(category, createCategoryDto);

    // Установка родителя, если он указан
    if (createCategoryDto.parent) {
      category.parent = await this.categoryRepository.findOneBy({
        id: createCategoryDto.parent,
      });
      if (!category.parent) {
        throw new HttpException(
          'Parent category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return await this.categoryRepository.save(category);
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    return await this.categoryRepository.findOneBy({ slug });
  }

  // async deleteCategory(slug: string): Promise<DeleteResult> {
  //   const article = await this.findBySlug(slug);
  //   if (!article) {
  //     throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
  //   }
  //   return await this.categoryRepository.delete({ slug });
  // }

  buildCategoryResponse(category: CategoryEntity): ICategoryResponse {
    return { category };
  }
}
