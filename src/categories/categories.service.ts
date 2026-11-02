
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category-entity.js';
import { CreateCategoryDto } from './dto/create-category-dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Menampilkan semua kategori
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  // Mengambil kategori berdasarkan ID UUID
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(
        `Kategori dengan ID ${id} tidak ditemukan`,
      );
    }

    return category;
  }

  // Menambahkan kategori baru
  async create(dto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(dto);

    return await this.categoryRepository.save(newCategory);
  }

  // Mengupdate kategori berdasarkan ID
  async update(
    id: string,
    dto: Partial<CreateCategoryDto>,
  ): Promise<Category> {
    const existingCategory = await this.findOne(id);

    Object.assign(existingCategory, dto);

    return await this.categoryRepository.save(existingCategory);
  }

  // Menghapus kategori berdasarkan ID
  async delete(
    id: string,
  ): Promise<{ message: string; deletedId: string }> {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);

    return {
      message: `Kategori dengan ID ${id} berhasil dihapus`,
      deletedId: id,
    };
  }
}
