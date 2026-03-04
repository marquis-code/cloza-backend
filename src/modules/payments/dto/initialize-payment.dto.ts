import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class InitializePaymentDto {
    @ApiProperty({ example: 'order-id-123' })
    @IsString()
    orderId: string;

    @ApiProperty({ example: 'conversation-id-123', required: false })
    @IsString()
    @IsOptional()
    conversationId?: string;
}
