import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from './order.entity.js';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  courier: string;

  @Column({ name: 'tracking_number', type: 'varchar', nullable: true, length: 100 })
  tracking_number: string | null;

  @Column({ length: 30, default: 'pending' })
  status: string;

  @Column({ name: 'shipped_at', type: 'timestamptz', nullable: true })
  shipped_at: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  delivered_at: Date | null;

  @ManyToOne(() => Order, (order) => order.shipments, {
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
