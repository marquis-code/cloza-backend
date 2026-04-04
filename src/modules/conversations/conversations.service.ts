import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SenderType, MessageFormat, Platform, MessageCategory, SenderIntent, EventType } from '@prisma/client';
import { MessageClassifierService, ClassificationResult } from './services/message-classifier.service';
import { BillingEngineService } from './services/billing-engine.service';
import { RoutingService } from './services/routing.service';
import { MetaProvider } from './providers/meta.provider';
import { FallbackProvider } from './providers/fallback.provider';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ConversationsService {
    private readonly logger = new Logger(ConversationsService.name);

    constructor(
        private prisma: PrismaService,
        private classifier: MessageClassifierService,
        private billing: BillingEngineService,
        private routing: RoutingService,
        private metaProvider: MetaProvider,
        private fallbackProvider: FallbackProvider,
        @InjectQueue('message-followup') private followupQueue: Queue,
    ) { }

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

    async sendMessage(senderId: string, senderType: SenderType, data: {
        conversationId: string;
        content: string;
        format?: MessageFormat;
        platform?: Platform;
        eventType?: EventType;
        senderIntent?: SenderIntent;
        payload?: any;
    }) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: data.conversationId },
            include: { customer: true }
        });

        if (!conversation) throw new BadRequestException('Conversation not found');

        const platform = data.platform || conversation.platform;

        // 1. Classification & Billing (Only for WhatsApp)
        let classification: ClassificationResult = {
            category: MessageCategory.SERVICE,
            confidence: 1.0,
            reasons: ['platform_bypass'],
        };
        let cost = 0;

        if (platform === Platform.WHATSAPP) {
            classification = await this.classifier.classifyMessage({
                conversation: {
                    lastUserMessageAt: conversation.lastUserMessageAt,
                    relatedOrderId: conversation.relatedOrderId,
                    relatedCartId: conversation.relatedCartId,
                },
                eventType: data.eventType || EventType.MANUAL_MESSAGE,
                senderIntent: data.senderIntent || SenderIntent.REPLY,
                content: { text: data.content },
            });

            if (classification.reasons.some(r => r.startsWith('blocked'))) {
                this.logger.warn(`Message blocked: ${classification.reasons.join(', ')}`);
                throw new BadRequestException(`Message sending blocked: ${classification.reasons[0]}`);
            }

            cost = await this.billing.calculateMessageCost(
                conversation.workspaceId,
                conversation.customerId,
                classification.category,
                conversation.relatedOrderId || undefined
            );
        }

        // 3. Routing
        const targetPlatform = await this.routing.routeMessage(conversation, conversation.customer);

        // 4. Send via Provider
        let externalId: string | null = null;
        try {
            const provider = classification.category === MessageCategory.MARKETING ? this.fallbackProvider : this.metaProvider;
            const response = await provider.sendMessage({
                to: conversation.customer.phone || conversation.customer.platformCustomerId || '',
                content: data.content,
                format: data.format || MessageFormat.TEXT,
                category: classification.category,
                platform: targetPlatform,
            });
            externalId = response.externalId;
        } catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
            // Auto fallback if Meta fails?
            const response = await this.fallbackProvider.sendMessage({
                to: conversation.customer.phone || conversation.customer.platformCustomerId || '',
                content: data.content,
                format: data.format || MessageFormat.TEXT,
                category: classification.category,
                platform: targetPlatform,
            });
            externalId = response.externalId;
        }

        // 5. Store in DB
        const message = await this.prisma.message.create({
            data: {
                conversationId: data.conversationId,
                senderId,
                senderType,
                content: data.content,
                format: data.format || MessageFormat.TEXT,
                category: classification.category,
                intent: data.senderIntent,
                confidence: classification.confidence,
                reasons: classification.reasons,
                cost: cost,
                externalId: externalId,
                payload: data.payload,
            },
        });

        // 6. Update Conversation
        await this.prisma.conversation.update({
            where: { id: data.conversationId },
            data: {
                lastUserMessageAt: senderType === SenderType.CUSTOMER ? new Date() : conversation.lastUserMessageAt,
            },
        });

        // 7. Schedule Follow-ups (Only if this was a customer message start)
        if (senderType === SenderType.CUSTOMER) {
            await this.scheduleFollowUps(data.conversationId);
        } else {
            // If sender is merchant, clear pending follow-up jobs (optional logic)
            // Or just let them fire if user didn't reply
        }

        return message;
    }

    private async scheduleFollowUps(conversationId: string) {
        // Clear previous follow-ups for this conversation if any
        // In BullMQ, we can try to remove by jobId directly
        try {
            await this.followupQueue.remove(`${conversationId}_1h`);
            await this.followupQueue.remove(`${conversationId}_6h`);
            await this.followupQueue.remove(`${conversationId}_23h`);
        } catch (e) {
            // Ignore if not exists
        }

        // 1 hour later
        await this.followupQueue.add('followup', { conversationId, type: '1h' }, { delay: 1 * 3600 * 1000, jobId: `${conversationId}_1h` });
        // 6 hours later
        await this.followupQueue.add('followup', { conversationId, type: '6h' }, { delay: 6 * 3600 * 1000, jobId: `${conversationId}_6h` });
        // 23 hours later
        await this.followupQueue.add('followup', { conversationId, type: '23h' }, { delay: 23 * 3600 * 1000, jobId: `${conversationId}_23h` });
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
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMessages(conversationId: string) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
