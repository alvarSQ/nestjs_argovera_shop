import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModule } from '@/cart/cart.module';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([OrderEntity]), CartModule],
=======
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    CartModule,
  ],
>>>>>>> 850ba22c9238813b1d4b37a4d55a6b52c86f75a3
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
