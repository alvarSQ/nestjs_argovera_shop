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
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCart(@User('id') currentUserId: number): Promise<CartResponseDto> {
    return this.cartService.getCart(currentUserId);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  async addToCart(
    @User('id') currentUserId: number,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(currentUserId, createCartItemDto);
  }

  @Delete('remove/:cartItemId')
  @UseGuards(AuthGuard)
  async removeFromCart(
    @User('id') currentUserId: number,
    @Param('cartItemId') cartItemId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(cartItemId, currentUserId);
  }
}
