import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly scores: number;

  @IsNotEmpty()
  readonly code: number;

  @IsNotEmpty()
  readonly image: string;

  @IsNotEmpty()
  readonly category: string;

  @IsNotEmpty()
  readonly brand: string;
}
