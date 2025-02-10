import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;
}
