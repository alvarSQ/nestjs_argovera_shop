import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeUpdate } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // ID пользователя

  @Column()
  totalAmount: number; // Общая сумма заказа

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  items: CartItemEntity[]; // Связь с элементами корзины

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
