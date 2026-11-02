import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  exports: [TypeOrmModule],
})
export class AuthorsModule {}
