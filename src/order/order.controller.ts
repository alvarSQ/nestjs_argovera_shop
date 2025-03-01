import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '@/user/decorators/user.decorator';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
} from './order.dto';
import { AuthGuard } from '@/user/guards/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
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
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status);
  }
}
