import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, Relation,
} from 'typeorm';
import { Book } from '../../books/entities/book-entity.js';

@Entity('publishers')
export class Publisher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => Book, book => book.publisher)
  books: Relation<Book>[];
}
