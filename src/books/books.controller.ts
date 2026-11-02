import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Controller('books')
export class BooksController {
  constructor(
    private readonly bookService: BooksService,
  ) {}

  // Menampilkan semua buku
  @Get()
  getAllBooks() {
    return this.bookService.findAll();
  }

  // Mengambil buku berdasarkan ID
  @Get(':id')
  getBookById(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  // Menambahkan buku baru
  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() book: CreateBookDto) {
    return this.bookService.create(book);
  }

  // Mengupdate buku berdasarkan ID
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateBook(
    @Param('id') id: string,
    @Body() book: Partial<CreateBookDto>,
  ) {
    return this.bookService.update(id, book);
  }

  // Menghapus buku berdasarkan ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
