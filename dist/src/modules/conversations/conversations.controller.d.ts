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
        lastUserMessageAt: Date | null;
        optInStatus: boolean;
        qualityRating: string | null;
        relatedOrderId: string | null;
        relatedCartId: string | null;
    }>;
    sendMessage(req: any, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        format: import("@prisma/client").$Enums.MessageFormat;
        category: import("@prisma/client").$Enums.MessageCategory;
        confidence: number | null;
        reasons: string[];
        conversationId: string;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        intent: import("@prisma/client").$Enums.SenderIntent | null;
        externalId: string | null;
        cost: import("@prisma/client-runtime-utils").Decimal | null;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
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
            format: import("@prisma/client").$Enums.MessageFormat;
            category: import("@prisma/client").$Enums.MessageCategory;
            confidence: number | null;
            reasons: string[];
            conversationId: string;
            senderId: string;
            senderType: import("@prisma/client").$Enums.SenderType;
            intent: import("@prisma/client").$Enums.SenderIntent | null;
            externalId: string | null;
            cost: import("@prisma/client-runtime-utils").Decimal | null;
            payload: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        platform: import("@prisma/client").$Enums.Platform;
        lastUserMessageAt: Date | null;
        optInStatus: boolean;
        qualityRating: string | null;
        relatedOrderId: string | null;
        relatedCartId: string | null;
    })[]>;
    getMessages(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        format: import("@prisma/client").$Enums.MessageFormat;
        category: import("@prisma/client").$Enums.MessageCategory;
        confidence: number | null;
        reasons: string[];
        conversationId: string;
        senderId: string;
        senderType: import("@prisma/client").$Enums.SenderType;
        intent: import("@prisma/client").$Enums.SenderIntent | null;
        externalId: string | null;
        cost: import("@prisma/client-runtime-utils").Decimal | null;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
