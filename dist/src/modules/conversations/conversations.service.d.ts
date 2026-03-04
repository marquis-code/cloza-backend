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
        platform: import("@prisma/client").$Enums.Platform;
        customerId: string;
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
    getMessages(conversationId: string): Promise<{
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
