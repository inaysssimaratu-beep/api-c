import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Book } from '../books/entities/book-entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { CustomerAddress } from '../customers/entities/customer-address.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    if (!dto.items?.length) {
      throw new BadRequestException('Pesanan harus memiliki minimal satu buku');
    }

    return this.dataSource.transaction(async (manager) => {
      const customerRepo = manager.getRepository(Customer);
      const addressRepo = manager.getRepository(CustomerAddress);
      const bookRepo = manager.getRepository(Book);
      const orderRepo = manager.getRepository(Order);
      const itemRepo = manager.getRepository(OrderItem);

      const customer = await customerRepo.findOneBy({
        id: dto.customer_id
      });

      if (!customer) {
        throw new NotFoundException('Customer tidak ditemukan');
      }

      const address = await addressRepo.findOne({
        where: { id: dto.shipping_address_id },
        relations: { customer: true },
      });

      if (!address || address.customer.id !== customer.id) {
        throw new BadRequestException(
          'Alamat pengiriman tidak ditemukan atau bukan milik customer tersebut'
        );
      }

      let subtotal = 0;
      const preparedItems: {
        book: Book;
        quantity: number;
        unit_price: string;
        subtotal: string;
      }[] = [];

      for (const requested of dto.items) {
        const book = await bookRepo.findOneBy({
          id: requested.book_id
        });

        if (!book) {
          throw new NotFoundException(
            `Buku ${requested.book_id} tidak ditemukan`
          );
        }

        if (!book.isAvailable) {
          throw new BadRequestException(
            `Buku "${book.name}" tidak tersedia`
          );
        }

        const price = Number(book.price);

        if (!Number.isFinite(price) || price < 0) {
          throw new BadRequestException(
            `Harga buku "${book.name}" tidak valid`
          );
        }

        const lineTotal = Math.round(price * requested.quantity * 100) / 100;
        subtotal += lineTotal;

        preparedItems.push({
          book,
          quantity: requested.quantity,
          unit_price: price.toFixed(2),
          subtotal: lineTotal.toFixed(2),
        });
      }

      subtotal = Math.round(subtotal * 100) / 100;
      const shippingCost = dto.shipping_cost ?? 0;

      if (!Number.isFinite(shippingCost) || shippingCost < 0) {
        throw new BadRequestException('Biaya pengiriman tidak valid');
      }

      const order = orderRepo.create({
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        status: 'pending',
        subtotal: subtotal.toFixed(2),
        shipping_cost: shippingCost.toFixed(2),
        total_amount: (subtotal + shippingCost).toFixed(2),
        customer,
        shipping_address: address,
      });

      const savedOrder = await orderRepo.save(order);

      const items = preparedItems.map((item) =>
        itemRepo.create({
          ...item,
          order: savedOrder,
        })
      );

      await itemRepo.save(items);

      return orderRepo.findOneOrFail({
        where: { id: savedOrder.id },
        relations: {
          customer: true,
          shipping_address: true,
          items: { book: true },
          payments: true,
          shipments: true,
        },
      });
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        customer: true,
        shipping_address: true,
        items: { book: true },
        payments: true,
        shipments: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        shipping_address: true,
        items: { book: true },
        payments: true,
        shipments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id);

    const transitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!transitions[order.status]?.includes(status)) {
      throw new BadRequestException(
        `Status tidak dapat diubah dari ${order.status} menjadi ${status}`
      );
    }

    order.status = status;
    await this.orderRepository.save(order);

    return this.findOne(id);
  }
}
