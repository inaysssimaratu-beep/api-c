
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // Menampilkan semua buku
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Mengambil buku berdasarkan ID UUID
  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(
        `Buku dengan ID ${id} tidak ditemukan`,
      );
    }

    return book;
  }

  // Menambahkan buku baru
  async create(dto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create(dto);

    return await this.bookRepository.save(newBook);
  }

  // Mengupdate buku berdasarkan ID
  async update(
    id: string,
    dto: Partial<CreateBookDto>,
  ): Promise<Book> {
    const existingBook = await this.findOne(id);

    Object.assign(existingBook, dto);

    return await this.bookRepository.save(existingBook);
  }

  // Menghapus buku berdasarkan ID
  async delete(
    id: string,
  ): Promise<{ message: string; deletedId: string }> {
    const book = await this.findOne(id);

    await this.bookRepository.remove(book);

    return {
      message: `Buku dengan ID ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}
