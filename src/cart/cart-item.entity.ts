import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity()
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cartId: number; // ID корзины

  @Column()
  productId: number; // ID товара

  @Column({ default: 1})
  quantity: number; // Количество товара

  @Column()
  price: number; // Цена товара

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity; // Связь с корзиной
}
