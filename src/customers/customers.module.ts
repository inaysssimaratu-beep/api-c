import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity.js';
import { CustomerAddress } from './entities/customer-address.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerAddress])],
  exports: [TypeOrmModule],
})
export class CustomersModule {}
