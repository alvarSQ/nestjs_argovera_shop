import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModule } from '@/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    CartModule,
  ],
  providers: [OrderService ],
  controllers: [OrderController],
})
export class OrderModule {}
