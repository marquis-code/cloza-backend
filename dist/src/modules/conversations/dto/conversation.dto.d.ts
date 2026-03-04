import { MessageType } from '@prisma/client';
export declare class CreateMessageDto {
    conversationId: string;
    content: string;
    type?: MessageType;
    payload?: any;
}
export declare class StartConversationDto {
    workspaceId: string;
    customerId: string;
    platform: any;
}
