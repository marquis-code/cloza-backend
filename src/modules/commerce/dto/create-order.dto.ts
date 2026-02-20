import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'workspace-id-123',
    description: 'The ID of the workspace for the order',
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    example: 'customer-id-456',
    description: 'The ID of the customer placing the order',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    example: ['product-id-1', 'product-id-2'],
    description: 'List of product IDs included in the order',
  })
  @IsArray()
  itemIds: string[];

  @ApiProperty({
    example: 'post-id-789',
    description: 'The ID of the post that generated this sale',
    required: false,
  })
  @IsString()
  @IsOptional()
  sourcePostId?: string;
}
