import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Sample Product',
    description: 'The name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A high-quality sample product for demonstration.',
    description: 'Detailed description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 2500,
    description: 'Price of the product in the local currency',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'workspace-id-123',
    description: 'The ID of the workspace this product belongs to',
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'List of media URLs for the product',
    required: false,
  })
  @IsArray()
  @IsOptional()
  mediaUrls?: string[];
}
