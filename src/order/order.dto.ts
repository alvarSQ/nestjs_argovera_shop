import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CartResponseDto } from '@/cart/cart.dto';
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
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  shippingAddress: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  @IsNumber()
  readonly totalAmount: number;

  readonly cart: CartResponseDto;
}
