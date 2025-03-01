import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  paymentMethod: string;

  @Column()
  shippingAddress: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  totalAmount: number; 

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
