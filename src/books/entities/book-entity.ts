
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
}
