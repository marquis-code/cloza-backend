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
var FollowUpProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const conversations_service_1 = require("../conversations.service");
const client_1 = require("@prisma/client");
let FollowUpProcessor = FollowUpProcessor_1 = class FollowUpProcessor extends bullmq_1.WorkerHost {
    prisma;
    conversationsService;
    logger = new common_1.Logger(FollowUpProcessor_1.name);
    constructor(prisma, conversationsService) {
        super();
        this.prisma = prisma;
        this.conversationsService = conversationsService;
    }
    async process(job) {
        const { conversationId, type } = job.data;
        this.logger.log(`Processing follow-up ${type} for conversation ${conversationId}`);
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
        if (!conversation)
            return;
        const now = new Date();
        const lastUserMsg = conversation.lastUserMessageAt;
        const isWithin24h = lastUserMsg ? (now.getTime() - lastUserMsg.getTime()) < 24 * 3600 * 1000 : false;
        if (!isWithin24h) {
            this.logger.log(`Follow-up ${type} skipped: Outside 24h window for ${conversationId}`);
            return;
        }
        const lastMessage = conversation.messages[0];
        if (lastMessage && lastMessage.senderType === client_1.SenderType.USER) {
            this.logger.log(`Follow-up ${type} skipped: Merchant already replied to ${conversationId}`);
            return;
        }
        const content = this.getFollowUpContent(type);
        await this.conversationsService.sendMessage('SYSTEM', client_1.SenderType.USER, {
            conversationId,
            content,
            format: client_1.MessageFormat.TEXT,
            eventType: client_1.EventType.MANUAL_MESSAGE,
            senderIntent: client_1.SenderIntent.REMINDER,
        });
        this.logger.log(`Follow-up ${type} sent successfully to ${conversationId}`);
    }
    getFollowUpContent(type) {
        switch (type) {
            case '1h': return "Hi there! Just checking if you have any questions about the products you were looking at? 😊";
            case '6h': return "Quick nudge! We're still here to help if you'd like to complete your order.";
            case '23h': return "Final reminder: Your cart is waiting! Our 24-hour window is closing soon. Let us know if you're ready! 🚀";
            default: return "Just checking back in!";
        }
    }
};
exports.FollowUpProcessor = FollowUpProcessor;
exports.FollowUpProcessor = FollowUpProcessor = FollowUpProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('message-followup'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        conversations_service_1.ConversationsService])
], FollowUpProcessor);
//# sourceMappingURL=followup.processor.js.map