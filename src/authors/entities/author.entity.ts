import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, Relation,
} from 'typeorm';
import { Book } from '../../books/entities/book-entity.js';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @ManyToMany(() => Book, book => book.authors)
  books: Relation<Book>[];
}
