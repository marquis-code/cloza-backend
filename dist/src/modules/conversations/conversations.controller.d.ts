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
        platform: import("@prisma/client").$Enums.Platform;
        customerId: string;
        lastMessageAt: Date;
    }>;
    sendMessage(req: any, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        content: string;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        conversationId: string;
    }>;
    getConversations(workspaceId: string): Promise<({
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            email: string | null;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        messages: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.MessageType;
            content: string;
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
        platform: import("@prisma/client").$Enums.Platform;
        customerId: string;
        lastMessageAt: Date;
    })[]>;
    getMessages(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        content: string;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
        conversationId: string;
    }[]>;
}
