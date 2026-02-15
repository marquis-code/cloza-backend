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
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    prisma;
    logger = new common_1.Logger(PaymentsService_1.name);
    paystackBaseUrl = 'https://api.paystack.co';
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async createPaymentLink(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { customer: true },
        });
        if (!order)
            throw new Error('Order not found');
        try {
            const response = await axios_1.default.post(`${this.paystackBaseUrl}/transaction/initialize`, {
                email: order.customer.email || 'customer@cloza.com',
                amount: Number(order.totalAmount) * 100,
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
            return { paymentLink };
        }
        catch (error) {
            this.logger.error(`Paystack Initialization Error: ${error.message}`);
            throw error;
        }
    }
    async handleWebhook(body, signature) {
        const event = body.event;
        const reference = body.data.reference;
        if (event === 'charge.success') {
            await this.prisma.order.update({
                where: { id: reference },
                data: {
                    status: client_1.OrderStatus.PAID,
                    paidAt: new Date(),
                },
            });
            this.logger.log(`Order ${reference} marked as PAID via webhook`);
        }
        return { status: 'success' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map