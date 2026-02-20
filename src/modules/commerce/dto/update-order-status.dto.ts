import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: 'COMPLETED',
    description: 'The new status of the order',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
