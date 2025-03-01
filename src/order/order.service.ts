import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, OrderResponseDto } from './order.dto';
import { CartResponseDto } from '@/cart/cart.dto';

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
    const order = await this.orderRepository.findOne({
      where: whereCondition,
      relations: ['items', 'items.product'], // Загружаем элементы заказа и продукты
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  private mapToResponseDto(
    order: OrderEntity,
    cart?: CartResponseDto,
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      status: order.status as any,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalAmount: Number(order.totalAmount),
      cart: cart || {
        id: null, // Или можно использовать реальный cart.id, если он сохранён
        userId: order.userId,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.image || '',
          scores: item.product.scores || 0,
          code: item.product.code || 0,
          weigh: item.product.weigh || 0,
        })),
      },
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

    // Создаём заказ
    const order = this.orderRepository.create({
      userId,
      paymentMethod: createOrderDto.paymentMethod,
      shippingAddress: createOrderDto.shippingAddress,
      totalAmount: cart.totalAmount,
      status: 'pending',
    });

    // Сохраняем заказ без элементов
    const savedOrder = await this.orderRepository.save(order);

    await this.cartService.transferCartItemsToOrder(cart.id, savedOrder);

    // Обновляем корзину в базе
    await this.cartService.clearCart(userId);

    // Получаем заказ с элементами
    const populatedOrder = await this.getOrderById(savedOrder.id);
    return this.mapToResponseDto(populatedOrder, cart);
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
