// cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from '@/product/product.entity';
import { OrderEntity } from '@/order/order.entity';

@Entity({ name: 'cart_item' })
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  cartId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => ProductEntity, { eager: true }) // Eager loading для автоматической загрузки продукта
  product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items, { nullable: true })
  order: OrderEntity; // Связь с заказом
}
