import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher])],
  exports: [TypeOrmModule],
})
export class PublishersModule {}
