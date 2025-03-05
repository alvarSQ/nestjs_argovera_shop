import { CartItemEntity } from '@/cart/cart-item.entity';
<<<<<<< HEAD
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
=======
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, OneToMany } from 'typeorm';
>>>>>>> 850ba22c9238813b1d4b37a4d55a6b52c86f75a3

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  paymentMethod: string;

  @Column()
  shippingAddress: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.order, {
    nullable: true,
  })
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
