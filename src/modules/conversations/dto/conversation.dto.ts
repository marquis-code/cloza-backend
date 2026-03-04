import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsJSON } from 'class-validator';
import { SenderType, MessageType } from '@prisma/client';

export class CreateMessageDto {
    @ApiProperty({ example: 'conversation-id-123' })
    @IsString()
    conversationId: string;

    @ApiProperty({ example: 'Hello, is this still available?' })
    @IsString()
    content: string;

    @ApiProperty({ enum: MessageType, default: MessageType.TEXT })
    @IsEnum(MessageType)
    @IsOptional()
    type?: MessageType;

    @ApiProperty({ example: { productId: '123' }, required: false })
    @IsOptional()
    payload?: any;
}

export class StartConversationDto {
    @ApiProperty({ example: 'workspace-id-123' })
    @IsString()
    workspaceId: string;

    @ApiProperty({ example: 'customer-id-123' })
    @IsString()
    customerId: string;

    @ApiProperty({ example: 'WHATSAPP' })
    @IsString()
    platform: any; // Using any for now to avoid enum mismatch if Platform isn't synced yet, but should be Platform
}
