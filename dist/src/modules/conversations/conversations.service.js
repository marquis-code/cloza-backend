"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ConversationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const message_classifier_service_1 = require("./services/message-classifier.service");
const billing_engine_service_1 = require("./services/billing-engine.service");
const routing_service_1 = require("./services/routing.service");
const meta_provider_1 = require("./providers/meta.provider");
const fallback_provider_1 = require("./providers/fallback.provider");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let ConversationsService = ConversationsService_1 = class ConversationsService {
    prisma;
    classifier;
    billing;
    routing;
    metaProvider;
    fallbackProvider;
    followupQueue;
    logger = new common_1.Logger(ConversationsService_1.name);
    constructor(prisma, classifier, billing, routing, metaProvider, fallbackProvider, followupQueue) {
        this.prisma = prisma;
        this.classifier = classifier;
        this.billing = billing;
        this.routing = routing;
        this.metaProvider = metaProvider;
        this.fallbackProvider = fallbackProvider;
        this.followupQueue = followupQueue;
    }
    async startConversation(workspaceId, customerId, platform) {
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
    async sendMessage(senderId, senderType, data) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: data.conversationId },
            include: { customer: true }
        });
        if (!conversation)
            throw new common_1.BadRequestException('Conversation not found');
        const platform = data.platform || conversation.platform;
        let classification = {
            category: client_1.MessageCategory.SERVICE,
            confidence: 1.0,
            reasons: ['platform_bypass'],
        };
        let cost = 0;
        if (platform === client_1.Platform.WHATSAPP) {
            classification = await this.classifier.classifyMessage({
                conversation: {
                    lastUserMessageAt: conversation.lastUserMessageAt,
                    relatedOrderId: conversation.relatedOrderId,
                    relatedCartId: conversation.relatedCartId,
                },
                eventType: data.eventType || client_1.EventType.MANUAL_MESSAGE,
                senderIntent: data.senderIntent || client_1.SenderIntent.REPLY,
                content: { text: data.content },
            });
            if (classification.reasons.some(r => r.startsWith('blocked'))) {
                this.logger.warn(`Message blocked: ${classification.reasons.join(', ')}`);
                throw new common_1.BadRequestException(`Message sending blocked: ${classification.reasons[0]}`);
            }
            cost = await this.billing.calculateMessageCost(conversation.workspaceId, conversation.customerId, classification.category, conversation.relatedOrderId || undefined);
        }
        const targetPlatform = await this.routing.routeMessage(conversation, conversation.customer);
        let externalId = null;
        try {
            const provider = classification.category === client_1.MessageCategory.MARKETING ? this.fallbackProvider : this.metaProvider;
            const response = await provider.sendMessage({
                to: conversation.customer.phone || conversation.customer.platformCustomerId || '',
                content: data.content,
                format: data.format || client_1.MessageFormat.TEXT,
                category: classification.category,
                platform: targetPlatform,
            });
            externalId = response.externalId;
        }
        catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
            const response = await this.fallbackProvider.sendMessage({
                to: conversation.customer.phone || conversation.customer.platformCustomerId || '',
                content: data.content,
                format: data.format || client_1.MessageFormat.TEXT,
                category: classification.category,
                platform: targetPlatform,
            });
            externalId = response.externalId;
        }
        const message = await this.prisma.message.create({
            data: {
                conversationId: data.conversationId,
                senderId,
                senderType,
                content: data.content,
                format: data.format || client_1.MessageFormat.TEXT,
                category: classification.category,
                intent: data.senderIntent,
                confidence: classification.confidence,
                reasons: classification.reasons,
                cost: cost,
                externalId: externalId,
                payload: data.payload,
            },
        });
        await this.prisma.conversation.update({
            where: { id: data.conversationId },
            data: {
                lastUserMessageAt: senderType === client_1.SenderType.CUSTOMER ? new Date() : conversation.lastUserMessageAt,
            },
        });
        if (senderType === client_1.SenderType.CUSTOMER) {
            await this.scheduleFollowUps(data.conversationId);
        }
        else {
        }
        return message;
    }
    async scheduleFollowUps(conversationId) {
        try {
            await this.followupQueue.remove(`${conversationId}_1h`);
            await this.followupQueue.remove(`${conversationId}_6h`);
            await this.followupQueue.remove(`${conversationId}_23h`);
        }
        catch (e) {
        }
        await this.followupQueue.add('followup', { conversationId, type: '1h' }, { delay: 1 * 3600 * 1000, jobId: `${conversationId}_1h` });
        await this.followupQueue.add('followup', { conversationId, type: '6h' }, { delay: 6 * 3600 * 1000, jobId: `${conversationId}_6h` });
        await this.followupQueue.add('followup', { conversationId, type: '23h' }, { delay: 23 * 3600 * 1000, jobId: `${conversationId}_23h` });
    }
    async getConversations(workspaceId) {
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
    async getMessages(conversationId) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = ConversationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, bullmq_1.InjectQueue)('message-followup')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        message_classifier_service_1.MessageClassifierService,
        billing_engine_service_1.BillingEngineService,
        routing_service_1.RoutingService,
        meta_provider_1.MetaProvider,
        fallback_provider_1.FallbackProvider,
        bullmq_2.Queue])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map