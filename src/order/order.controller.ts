import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '@/user/decorators/user.decorator';
import { ValidationPipe } from '@nestjs/common';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
} from './order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(
    @User('id') currentUserId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrderFromCart(currentUserId, createOrderDto);
  }

  @Get(':id')
  async getOrder(
    @User('id') currentUserId: number,
    @Param('id') id: number,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrder(id, currentUserId);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status);
  }
}
