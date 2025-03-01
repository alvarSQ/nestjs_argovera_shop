// order.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CartResponseDto } from '@/cart/cart.dto';

enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  readonly shippingAddress: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  readonly status: OrderStatus;
}

export class OrderResponseDto {
  @IsNumber()
  readonly id: number;

  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly paymentMethod: string;

  @IsString()
  readonly shippingAddress: string;

  @IsEnum(OrderStatus)
  readonly status: OrderStatus;

  @Type(() => Date)
  readonly createdAt: Date;

  @Type(() => Date)
  readonly updatedAt: Date;

  @IsNumber()
  readonly totalAmount: number;

  readonly cart: CartResponseDto; // Добавляем CartResponseDto
}
