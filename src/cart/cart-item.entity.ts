// cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from '@/product/product.entity';

@Entity()
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
}
