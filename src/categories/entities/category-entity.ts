
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Book } from '../../books/entities/book-entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  // Satu kategori memiliki banyak buku
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
