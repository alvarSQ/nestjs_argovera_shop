import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-item.entity';
import {
  CartResponseDto,
  CreateCartItemDto,
  CartItemResponseDto,
} from './cart.dto';
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

  private mapItemToResponseDto(item: CartItemEntity): CartItemResponseDto {
    return {
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
    };
  }

  private mapToResponseDto(cart: CartEntity): CartResponseDto {
    return {
      id: cart.id,
      userId: cart.userId,
      totalAmount: Number(cart.totalAmount),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => this.mapItemToResponseDto(item)),
    };
  }

  private async getOrCreateCart(userId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'], // Загружаем items и связанные продукты
    });

    if (cart) return cart;

    return this.cartRepository.save(
      this.cartRepository.create({
        userId,
        totalAmount: 0,
        items: [],
      }),
    );
  }

  private async calculateAndUpdateTotal(
    cart: CartEntity,
  ): Promise<CartResponseDto> {
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await this.cartRepository.save(cart);
    return this.mapToResponseDto(cart);
  }

  async getCart(userId: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);
    return this.mapToResponseDto(cart);
  }

  async addToCart(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: createCartItemDto.productId },
      relations: ['product'],
    });

    if (existingItem) {
      existingItem.quantity += createCartItemDto.quantity;
      await this.cartItemRepository.save(existingItem);
      const itemIndex = cart.items.findIndex(
        (item) => item.id === existingItem.id,
      );
      if (itemIndex !== -1) {
        cart.items[itemIndex] = existingItem;
      }
    } else {
      const product = await this.getProduct(createCartItemDto.productId);
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: createCartItemDto.productId,
        quantity: createCartItemDto.quantity,
        price: product.price,
        product, // Связываем продукт с элементом корзины
      });
      const savedItem = await this.cartItemRepository.save(newItem);
      cart.items.push(savedItem);
    }

    return this.calculateAndUpdateTotal(cart);
  }

  async removeFromCart(
    cartItemId: number,
    userId: number,
  ): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);
    const result = await this.cartItemRepository.delete({
      id: cartItemId,
      cartId: cart.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }

    cart.items = cart.items.filter((item) => item.id !== cartItemId);
    return this.calculateAndUpdateTotal(cart);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
    cart.items = [];
    await this.calculateAndUpdateTotal(cart);
  }

  private async getProduct(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
