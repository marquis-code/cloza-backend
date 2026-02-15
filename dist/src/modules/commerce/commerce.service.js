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
let CommerceService = class CommerceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
    async createOrder(workspaceId, customerId, itemIds) {
        const products = await this.prisma.product.findMany({
            where: { id: { in: itemIds }, workspaceId },
        });
        const totalAmount = products.reduce((acc, p) => acc + Number(p.price), 0);
        return this.prisma.order.create({
            data: {
                workspaceId,
                customerId,
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
                items: true,
                customer: true,
            },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommerceService);
//# sourceMappingURL=commerce.service.js.map