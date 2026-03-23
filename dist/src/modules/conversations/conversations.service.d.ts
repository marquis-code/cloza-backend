import { PrismaService } from '../../common/prisma/prisma.service';
import { SenderType, MessageType, Platform } from '@prisma/client';
export declare class ConversationsService {
    private prisma;
    constructor(prisma: PrismaService);
    startConversation(workspaceId: string, customerId: string, platform: Platform): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        platform: import("@prisma/client").$Enums.Platform;
        lastMessageAt: Date;
    }>;
    sendMessage(senderId: string, senderType: SenderType, data: {
        conversationId: string;
        content: string;
        type?: MessageType;
        payload?: any;
    }): Promise<{
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
    getMessages(conversationId: string): Promise<{
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
