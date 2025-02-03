import { IsNotEmpty } from 'class-validator';

export class createBrandDto {
  @IsNotEmpty()
  readonly name: string;
}
