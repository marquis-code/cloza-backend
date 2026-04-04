import { MessageFormat, Platform } from '@prisma/client';
export declare class CreateMessageDto {
    conversationId: string;
    content: string;
    format?: MessageFormat;
    platform?: Platform;
    payload?: any;
}
export declare class StartConversationDto {
    workspaceId: string;
    customerId: string;
    platform: any;
}
