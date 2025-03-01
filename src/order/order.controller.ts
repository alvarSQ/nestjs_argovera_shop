// order.controller.ts
import { Controller, Post, Get, Patch, Body, Req, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { User } from '@/user/decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @User('id') currentUserId: number,
    @Body() body: { paymentMethod: string; shippingAddress: string },
  ): Promise<OrderEntity> {
    return this.orderService.createOrderFromCart(
      currentUserId,
      body.paymentMethod,
      body.shippingAddress,
    );
  }

  @Get(':id')
  async getOrder(
    @User('id') currentUserId: number,
    @Param('id') id: number,
  ): Promise<OrderEntity> {
    return this.orderService.getOrder(id, currentUserId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: string },
  ): Promise<OrderEntity> {
    return this.orderService.updateOrderStatus(id, body.status);
  }
}
