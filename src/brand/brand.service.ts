import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';
import { DeleteResult, Repository } from 'typeorm';
import dataSource from '@/dataSource';
import { Response } from 'express';
import { IBrandsResponse } from './types/brandsResponse.interface';
import { CreateBrandDto } from './dto/createBrand.dto';
import { IBrandResponse } from './types/brandResponse.interface';
import { parse } from 'csv-parse';
import * as json2csv from 'json2csv';
import { IProductInBrandResponse } from './types/productInBrandResponse.interface';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async importBrandsFromCSV(
    file: Express.Multer.File,
  ): Promise<{ message: string; result: BrandEntity[] }> {
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
      const results: CreateBrandDto[] = [];
      parser.on('readable', () => {
        let record: { name: string; image: string };
        while ((record = parser.read()) !== null) {
          // Проверка на наличие полей
          if (!record.name || !record.image) {
            console.warn('CSV record missing required fields:', record);
            continue; // Пропускаем запись, если у нее нет обязательных полей
          }
          results.push({
            name: record.name,
            image: record.image,
          });
        }
      });
      parser.on('error', (error) => {
        console.error('CSV Parsing Error:', error);
        reject(new BadRequestException('Invalid CSV file'));
      });
      parser.on('end', async () => {
        try {
          const importedBrands = await this.importBrands(results);
          resolve({ message: 'Import successful', result: importedBrands });
        } catch (error) {
          reject(error);
        }
      });
      parser.write(file.buffer);
      parser.end();
    });
  }

  async importBrands(records: CreateBrandDto[]): Promise<BrandEntity[]> {
    const brands: BrandEntity[] = [];

    for (const record of records) {
      const brand = this.brandRepository.create({
        name: record.name,
        image: record.image,
      });

      const savedBrand = await this.brandRepository.save(brand);
      brands.push(savedBrand);
    }

    return brands;
  }

  async exportBrands(): Promise<CreateBrandDto[]> {
    const brands = await this.brandRepository.find();

    return brands.map((brand) => ({
      name: brand.name,
      image: brand.image,
    }));
  }

  async jsonToCsv(res: Response) {
    const brands = await this.exportBrands();
    // Преобразование массива объектов в CSV строку
    const csv = json2csv.parse(brands);

    res.set('Content-Type', 'text/csv');
    res.set(
      'Content-Disposition',
      `attachment; filename="brands_${Date.now()}.csv"`,
    );
    res.send(csv);
  }

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

  async findBySlug(slug: string): Promise<IProductInBrandResponse> {
    const brand = await this.brandRepository.findOne({
      where: { slug },
      relations: ['products'],
    });

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    return { brand, products: brand.products };
  }

  async deleteBrand(slug: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Статья не найдена', HttpStatus.NOT_FOUND);
    }
    return await this.brandRepository.delete({ slug });
  }

  buildBrandResponse(brand: BrandEntity): IBrandResponse {
    return { brand };
  }
}
