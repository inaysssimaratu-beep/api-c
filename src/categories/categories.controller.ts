
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  // Menampilkan semua kategori
  @Get()
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  // Mengambil kategori berdasarkan ID
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // Menambahkan kategori baru
  @Post()
  createCategory(@Body() category: { name: string }) {
    return this.categoriesService.create(category);
  }

  // Mengupdate kategori berdasarkan ID
  @Put(':id')
  updateCategory(
    @Param('id') id: string,
    @Body() category: { name?: string },
  ) {
    return this.categoriesService.update(id, category);
  }

  // Menghapus kategori berdasarkan ID
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
