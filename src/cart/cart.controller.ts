import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResponseDto, CreateCartItemDto } from './cart.dto';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@User('id') currentUserId: number): Promise<CartResponseDto> {
    return this.cartService.getCart(currentUserId);
  }

  @Post('add')
  async addToCart(
    @User('id') currentUserId: number,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(currentUserId, createCartItemDto);
  }

  @Delete('remove/:cartItemId')
  async removeFromCart(
    @User('id') currentUserId: number,
    @Param('cartItemId') cartItemId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(cartItemId, currentUserId);
  }
}
