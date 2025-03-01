import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
  ) {}

  async createOrderFromCart(
    userId: number,
    paymentMethod: string,
    shippingAddress: string,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.getCart(userId);

    const order = this.orderRepository.create({
      userId,
      paymentMethod,
      shippingAddress,
      totalAmount: cart.totalAmount,
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Здесь можно добавить логику очистки корзины после создания заказа
    // await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getOrder(id: number, userId: number): Promise<OrderEntity> {
    return this.orderRepository.findOneOrFail({
      where: { id, userId },
    });
  }

  async updateOrderStatus(id: number, status: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOneOrFail({ where: { id } });
    order.status = status;
    return this.orderRepository.save(order);
  }
}
