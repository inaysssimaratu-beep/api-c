import { Order } from '../../orders/entities/order.entity.js';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { Relation } from 'typeorm';
import { Customer } from './customer.entity.js';

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  label: string;

  @Column({ name: 'recipient_name', length: 150 })
  recipient_name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  province: string;

  @Column({ name: 'postal_code', length: 10 })
  postal_code: string;

  @Column({ name: 'is_default', default: false })
  is_default: boolean;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.shipping_address)
  orders: Relation<Order>[];
}
