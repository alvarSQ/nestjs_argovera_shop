import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
