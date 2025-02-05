import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly image: string;

  readonly parent?: number;
}
