import { Order } from '../../orders/entities/order.entity.js';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import type { Relation } from 'typeorm';
import { CustomerAddress } from './customer-address.entity.js';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', length: 150 })
  full_name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses: Relation<CustomerAddress[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Relation<Order>[];
}
