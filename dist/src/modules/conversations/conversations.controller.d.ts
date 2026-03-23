import { ConversationsService } from './conversations.service';
import { CreateMessageDto, StartConversationDto } from './dto/conversation.dto';
export declare class ConversationsController {
    private conversationsService;
    constructor(conversationsService: ConversationsService);
    startConversation(dto: StartConversationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        platform: import("@prisma/client").$Enums.Platform;
        lastMessageAt: Date;
    }>;
    sendMessage(req: any, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        type: import("@prisma/client").$Enums.MessageType;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        conversationId: string;
    }>;
    getConversations(workspaceId: string): Promise<({
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            platform: import("@prisma/client").$Enums.Platform | null;
            phone: string | null;
            platformCustomerId: string | null;
        };
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            type: import("@prisma/client").$Enums.MessageType;
            senderId: string;
            senderType: import("@prisma/client").$Enums.SenderType;
            payload: import("@prisma/client/runtime/client").JsonValue | null;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        platform: import("@prisma/client").$Enums.Platform;
        lastMessageAt: Date;
    })[]>;
    getMessages(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        type: import("@prisma/client").$Enums.MessageType;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        conversationId: string;
    }[]>;
}
