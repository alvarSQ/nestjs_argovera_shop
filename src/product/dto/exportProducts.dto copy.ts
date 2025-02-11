import { UpdateProductDto } from './updateProduct.dto';

export class ExportProductsDto extends UpdateProductDto {
  readonly rating: number;

  readonly voices: number;

  readonly views: number;

  readonly reviews: string[];

  readonly favoritesCount: number;
}
