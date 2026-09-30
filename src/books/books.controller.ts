import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Controller('books') //decorator
export class BooksController {
    constructor(private booksService: BooksService) {}

    //menampilkan data atau mengambil data
    @Get()
    getAllBooks() {
        return this.booksService.findAll();
    }

    //mengambil data berdasarkan id
    @Get(':id')
    getBookById(@Param('id') id: string) {
        //logic untuk mengambil data buku berdasarkan id dari database
        return this.booksService.findOne(Number(id));
    }

    //menyimpan data buku baru berdasarkan id
    @Post()
    createBook(@Body() book: CreateBookDto){
        //logic untuk menyimpan data buku baru ke database
        return this.booksService.create(book);
    }
        //mengupdate data buku berdasarkan id
        @Put(':id')
        updateBook(
            @Param('id') id: string,
            @Body() book: CreateBookDto)
        {
            return this.booksService.update(Number(id), book);
        }

        @Delete(':id')
        deleteBook(@Param('id') id: string) {
            return this.booksService.delete(Number(id));
        }
}
