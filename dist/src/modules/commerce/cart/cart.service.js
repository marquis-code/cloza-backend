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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, customerId, data) {
        return this.prisma.cart.create({
            data: {
                workspaceId,
                customerId,
                items: data.items,
                totalAmount: data.totalAmount,
                currency: data.currency || 'NGN',
            },
        });
    }
    async findOne(id) {
        const cart = await this.prisma.cart.findUnique({
            where: { id },
        });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        return cart;
    }
    async update(id, data) {
        return this.prisma.cart.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.cart.delete({
            where: { id },
        });
    }
    async findByCustomer(workspaceId, customerId) {
        return this.prisma.cart.findMany({
            where: { workspaceId, customerId },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map