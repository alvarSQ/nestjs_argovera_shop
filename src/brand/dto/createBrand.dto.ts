import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly image: string;
}
