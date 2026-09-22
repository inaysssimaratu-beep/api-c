import { Controller, Get } from '@nestjs/common';

@Controller('books') //decorator
export class BooksController {
    //menampilkan data atau mengambil data
    @Get()
    getAllBooks():string {
        return "Menampilkan semua data buku";
    }
}