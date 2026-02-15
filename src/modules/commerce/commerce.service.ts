import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class CommerceService {
    constructor(private prisma: PrismaService) { }

    // Products
    async createProduct(workspaceId: string, data: Prisma.ProductCreateWithoutWorkspaceInput) {
        return this.prisma.product.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }

    async getProducts(workspaceId: string) {
        return this.prisma.product.findMany({
            where: { workspaceId, active: true },
        });
    }

    // Customers
    async findOrCreateCustomer(workspaceId: string, data: Prisma.CustomerUncheckedCreateInput) {
        const existing = await this.prisma.customer.findFirst({
            where: {
                workspaceId,
                OR: [
                    { email: data.email },
                    { phone: data.phone },
                    { platformCustomerId: data.platformCustomerId },
                ].filter(Boolean) as any,
            },
        });

        if (existing) return existing;

        return this.prisma.customer.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }

    // Orders
    async createOrder(workspaceId: string, customerId: string, itemIds: string[]) {
        const products = await this.prisma.product.findMany({
            where: { id: { in: itemIds }, workspaceId },
        });

        const totalAmount = products.reduce((acc, p) => acc + Number(p.price), 0);

        return this.prisma.order.create({
            data: {
                workspaceId,
                customerId,
                totalAmount,
                status: OrderStatus.PENDING,
                items: {
                    create: products.map((p) => ({
                        productId: p.id,
                        price: p.price,
                        quantity: 1, // Defaulting to 1 for MVP
                    })),
                },
            },
            include: {
                items: true,
                customer: true,
            },
        });
    }

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }

    async getOrders(workspaceId: string) {
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
}
