import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
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
  @Min(0)
  totalAmount: number;
}
