import { IsInt, IsNumber, Min, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly quantity: number;
}

export class CartItemResponseDto {
  readonly id: number;
  readonly productId: number;
  readonly quantity: number;
  readonly price: number;
}

export class CartResponseDto {
  readonly id: number;
  readonly userId: number;
  readonly totalAmount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly items: CartItemResponseDto[];
}

export class RemoveCartItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;
}
