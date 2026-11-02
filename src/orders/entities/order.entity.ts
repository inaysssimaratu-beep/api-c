import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity.js';
import { CustomerAddress } from '../../customers/entities/customer-address.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Payment } from './payment.entity.js';
import { Shipment } from './shipment.entity.js';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true, length: 50 })
  order_number: string;

  @Column({ length: 30, default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  shipping_cost: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_amount: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @ManyToOne(() => CustomerAddress, (address) => address.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: Relation<CustomerAddress>;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: Relation<OrderItem>[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Relation<Payment>[];

  @OneToMany(() => Shipment, (shipment) => shipment.order)
  shipments: Relation<Shipment>[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
