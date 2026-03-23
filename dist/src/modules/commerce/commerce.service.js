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
exports.CommerceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const mailer_service_1 = require("../mailer/mailer.service");
let CommerceService = class CommerceService {
    prisma;
    mailerService;
    constructor(prisma, mailerService) {
        this.prisma = prisma;
        this.mailerService = mailerService;
    }
    async createProduct(workspaceId, data) {
        return this.prisma.product.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }
    async getProducts(workspaceId) {
        return this.prisma.product.findMany({
            where: { workspaceId, active: true },
        });
    }
    async findOrCreateCustomer(workspaceId, data) {
        const existing = await this.prisma.customer.findFirst({
            where: {
                workspaceId,
                OR: [
                    { email: data.email },
                    { phone: data.phone },
                    { platformCustomerId: data.platformCustomerId },
                ].filter(Boolean),
            },
        });
        if (existing)
            return existing;
        return this.prisma.customer.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }
    async createOrder(workspaceId, customerId, itemIds, sourcePostId) {
        const products = await this.prisma.product.findMany({
            where: { id: { in: itemIds }, workspaceId },
        });
        const totalAmount = products.reduce((acc, p) => acc + Number(p.price), 0);
        const order = await this.prisma.order.create({
            data: {
                workspaceId,
                customerId,
                sourcePostId,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
                items: {
                    create: products.map((p) => ({
                        productId: p.id,
                        price: p.price,
                        quantity: 1,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                },
                customer: true,
                workspace: {
                    include: {
                        members: {
                            where: { role: 'OWNER' },
                            include: { user: true }
                        }
                    }
                }
            },
        });
        if (order.customer.email) {
            await this.mailerService.sendOrderConfirmation(order.customer.email, order.customer.name, order.id, `${order.totalAmount} ${order.currency}`, order.items.map(i => ({ name: i.product.name, quantity: i.quantity, price: `${i.price} ${order.currency}` })));
        }
        const owners = order.workspace.members;
        for (const owner of owners) {
            await this.mailerService.sendNewBuyerAlert(owner.user.email, owner.user.name || 'Merchant', `${order.totalAmount} ${order.currency}`, 'Cloza Checkout');
        }
        return order;
    }
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
    async getOrders(workspaceId) {
        return this.prisma.order.findMany({
            where: { workspaceId },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.CommerceService = CommerceService;
exports.CommerceService = CommerceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService])
], CommerceService);
//# sourceMappingURL=commerce.service.js.map