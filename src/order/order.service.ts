import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, OrderResponseDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
  ) {}

  private async getOrderById(
    id: number,
    userId?: number,
  ): Promise<OrderEntity> {
    const whereCondition = userId ? { id, userId } : { id };
    const order = await this.orderRepository.findOne({ where: whereCondition });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  private mapToResponseDto(order: OrderEntity): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      status: order.status as any,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalAmount: Number(order.totalAmount),
    };
  }

  async createOrderFromCart(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items.length || cart.totalAmount <= 0) {
      throw new NotFoundException('Cannot create order: cart is empty');
    }

    const order = await this.orderRepository.save(
      this.orderRepository.create({
        userId,
        paymentMethod: createOrderDto.paymentMethod,
        shippingAddress: createOrderDto.shippingAddress,
        totalAmount: cart.totalAmount,
        status: 'pending',
      }),
    );

    await this.cartService.clearCart(userId);
    return this.mapToResponseDto(order);
  }

  async getOrder(id: number, userId: number): Promise<OrderResponseDto> {
    const order = await this.getOrderById(id, userId);
    return this.mapToResponseDto(order);
  }

  async updateOrderStatus(
    id: number,
    status: string,
  ): Promise<OrderResponseDto> {
    const order = await this.getOrderById(id);
    order.status = status;
    await this.orderRepository.save(order);
    return this.mapToResponseDto(order);
  }
}
