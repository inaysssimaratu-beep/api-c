import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from './order.entity.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_method', length: 50 })
  payment_method: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ length: 30, default: 'pending' })
  status: string;

  @Column({ name: 'transaction_reference', type: 'varchar', nullable: true, length: 150 })
  transaction_reference: string | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paid_at: Date | null;

  @ManyToOne(() => Order, (order) => order.payments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
