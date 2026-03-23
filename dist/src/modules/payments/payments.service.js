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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const conversations_service_1 = require("../conversations/conversations.service");
const mailer_service_1 = require("../mailer/mailer.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    prisma;
    conversationsService;
    mailerService;
    logger = new common_1.Logger(PaymentsService_1.name);
    paystackBaseUrl = 'https://api.paystack.co';
    constructor(configService, prisma, conversationsService, mailerService) {
        this.configService = configService;
        this.prisma = prisma;
        this.conversationsService = conversationsService;
        this.mailerService = mailerService;
    }
    async createPaymentLink(orderId, conversationId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { customer: true },
        });
        if (!order)
            throw new Error('Order not found');
        try {
            const response = await axios_1.default.post(`${this.paystackBaseUrl}/transaction/initialize`, {
                email: order.customer.email || 'customer@cloza.com',
                amount: Math.round(Number(order.totalAmount) * 100),
                reference: order.id,
                callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
            }, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                    'Content-Type': 'application/json',
                },
            });
            const paymentLink = response.data.data.authorization_url;
            await this.prisma.order.update({
                where: { id: orderId },
                data: { paymentLink },
            });
            if (conversationId) {
                await this.conversationsService.sendMessage(order.workspaceId, client_1.SenderType.USER, {
                    conversationId,
                    content: `Here's the payment link for your order: ${paymentLink}`,
                    type: client_1.MessageType.PAYMENT_LINK,
                    payload: { orderId, paymentLink },
                });
            }
            return { paymentLink };
        }
        catch (error) {
            this.logger.error(`Paystack Initialization Error: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    }
    async addPayoutAccount(workspaceId, data) {
        return this.prisma.payoutAccount.create({
            data: {
                ...data,
                workspaceId,
                isDefault: true,
            },
        });
    }
    async getPayoutAccounts(workspaceId) {
        return this.prisma.payoutAccount.findMany({
            where: { workspaceId },
        });
    }
    async handleWebhook(body, signature) {
        const event = body.event;
        const reference = body.data.reference;
        if (event === 'charge.success') {
            const order = await this.prisma.order.update({
                where: { id: reference },
                data: {
                    status: client_1.OrderStatus.PAID,
                    paidAt: new Date(),
                },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    workspace: {
                        include: {
                            members: {
                                where: { role: 'OWNER' },
                                include: { user: true },
                            },
                        },
                    },
                },
            });
            this.logger.log(`Order ${reference} marked as PAID via webhook`);
            if (order.customer.email) {
                await this.mailerService.sendOrderConfirmation(order.customer.email, order.customer.name, order.id, `${order.totalAmount} ${order.currency}`, order.items.map((i) => ({
                    name: i.product.name,
                    quantity: i.quantity,
                    price: `${i.price} ${order.currency}`,
                })));
            }
            const owners = order.workspace.members;
            for (const owner of owners) {
                await this.mailerService.sendNewBuyerAlert(owner.user.email, owner.user.name || 'Merchant', `${order.totalAmount} ${order.currency}`, 'Cloza Checkout');
            }
        }
        return { status: 'success' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        conversations_service_1.ConversationsService,
        mailer_service_1.MailerService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map