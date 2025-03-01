import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { CartService } from '@/cart/cart.service';
import { CartEntity } from '@/cart/cart.entity';
import { CartItemEntity } from '@/cart/cart-item.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CartEntity, CartItemEntity]),
  ],
  providers: [OrderService, CartService],
  controllers: [OrderController],
})
export class OrderModule {}
