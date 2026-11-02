import {
  IsArray, IsInt, IsNumber, IsOptional, IsUUID,
  Min, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsUUID()
  book_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customer_id: string;

  @IsUUID()
  shipping_address_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shipping_cost?: number;
}
