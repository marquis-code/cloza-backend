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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ConversationsService = class ConversationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        const message = await this.prisma.message.create({
            data: {
                conversationId: data.conversationId,
                senderId,
                senderType,
                content: data.content,
                type: data.type || client_1.MessageType.TEXT,
                payload: data.payload,
            },
        });
        await this.prisma.conversation.update({
            where: { id: data.conversationId },
            data: { lastMessageAt: new Date() },
        });
        return message;
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
            orderBy: { lastMessageAt: 'desc' },
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
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map