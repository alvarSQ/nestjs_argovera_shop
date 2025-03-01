// cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-item.entity';
import { CartResponseDto, CreateCartItemDto } from './cart.dto';
import { ProductEntity } from '@/product/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private mapToResponseDto(cart: CartEntity): CartResponseDto {
    return {
      id: cart.id,
      userId: cart.userId,
      totalAmount: cart.totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  async getCart(userId: number): Promise<CartResponseDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        totalAmount: 0,
      });
      await this.cartRepository.save(cart);
    }

    return this.mapToResponseDto(cart);
  }

  async addToCart(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(userId);

    const existingItem = await this.cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        productId: createCartItemDto.productId,
      },
    });

    if (existingItem) {
      existingItem.quantity += createCartItemDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: createCartItemDto.productId,
        quantity: createCartItemDto.quantity,
        price: await this.getProductPrice(createCartItemDto.productId),
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.updateCartTotal(cart.id);
  }

  async updateCartTotal(cartId: number): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    const total = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    cart.totalAmount = total;
    await this.cartRepository.save(cart);

    return this.mapToResponseDto(cart);
  }

  async removeFromCart(
    cartItemId: number,
    userId: number,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ id: cartItemId, cartId: cart.id });
    return this.updateCartTotal(cart.id);
  }

  private async getProductPrice(productId: number): Promise<number> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    return product.price;
  }
}
