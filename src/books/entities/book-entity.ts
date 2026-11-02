import { OrderItem } from '../../orders/entities/order-item.entity.js';

import { ManyToMany, JoinTable, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Author } from '../../authors/entities/author.entity.js';
import { Publisher } from '../../publishers/entities/publisher.entity.js';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category-entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  author: string;

  @Column({ type: 'varchar' })
  isbn: string;

  @Column({ type: 'int' })
  publishedYear: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: string;

  // Relasi Many-to-One dengan Category
  @ManyToOne(() => Category, (category) => category.books, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Publisher, publisher => publisher.books, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  publisher: Relation<Publisher> | null;

  @ManyToMany(() => Author, author => author.books)
  @JoinTable({
    name: 'books_authors',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
  })
  authors: Relation<Author>[];


  @OneToMany(() => OrderItem, (item) => item.book)
  orderItems: Relation<OrderItem>[];
}
