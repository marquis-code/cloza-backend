import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
export declare class CommerceService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(workspaceId: string, data: Prisma.ProductCreateWithoutWorkspaceInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
        workspaceId: string;
    }>;
    getProducts(workspaceId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
        workspaceId: string;
    }[]>;
    findOrCreateCustomer(workspaceId: string, data: Prisma.CustomerUncheckedCreateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        email: string | null;
        phone: string | null;
        platform: import("@prisma/client").$Enums.Platform | null;
        platformCustomerId: string | null;
    }>;
    createOrder(workspaceId: string, customerId: string, itemIds: string[], sourcePostId?: string): Promise<{
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            email: string | null;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: {
            id: string;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    }>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    }>;
    getOrders(workspaceId: string): Promise<({
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            email: string | null;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: Prisma.Decimal;
                currency: string;
                imageUrl: string | null;
                stock: number;
                active: boolean;
                workspaceId: string;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    })[]>;
}
