import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SenderType, MessageType, Platform } from '@prisma/client';

@Injectable()
export class ConversationsService {
    constructor(private prisma: PrismaService) { }

    async startConversation(workspaceId: string, customerId: string, platform: Platform) {
        let conversation = await this.prisma.conversation.findFirst({
            where: { workspaceId, customerId, platform },
        });

        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: { workspaceId, customerId, platform },
            });
        }

        return conversation;
    }

    async sendMessage(senderId: string, senderType: SenderType, data: { conversationId: string; content: string; type?: MessageType; payload?: any }) {
        const message = await this.prisma.message.create({
            data: {
                conversationId: data.conversationId,
                senderId,
                senderType,
                content: data.content,
                type: data.type || MessageType.TEXT,
                payload: data.payload,
            },
        });

        await this.prisma.conversation.update({
            where: { id: data.conversationId },
            data: { lastMessageAt: new Date() },
        });

        return message;
    }

    async getConversations(workspaceId: string) {
        return this.prisma.conversation.findMany({
            where: { workspaceId },
            include: {
                customer: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { lastMessageAt: 'desc' },
        });
    }

    async getMessages(conversationId: string) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
