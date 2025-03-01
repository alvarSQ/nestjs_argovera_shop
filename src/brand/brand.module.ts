import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
