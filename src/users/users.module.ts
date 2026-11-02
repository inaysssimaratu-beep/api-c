import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/user-entity.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
