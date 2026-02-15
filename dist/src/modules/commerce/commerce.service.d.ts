import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
export declare class CommerceService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(workspaceId: string, data: Prisma.ProductCreateWithoutWorkspaceInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        price: Prisma.Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
    }>;
    getProducts(workspaceId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        price: Prisma.Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
    }[]>;
    findOrCreateCustomer(workspaceId: string, data: Prisma.CustomerUncheckedCreateInput): Promise<{
        name: string;
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        phone: string | null;
        platform: import("@prisma/client").$Enums.Platform | null;
        platformCustomerId: string | null;
    }>;
    createOrder(workspaceId: string, customerId: string, itemIds: string[]): Promise<{
        customer: {
            name: string;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: {
            id: string;
            price: Prisma.Decimal;
            quantity: number;
            orderId: string;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    }>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    }>;
    getOrders(workspaceId: string): Promise<({
        customer: {
            name: string;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                workspaceId: string;
                description: string | null;
                price: Prisma.Decimal;
                currency: string;
                imageUrl: string | null;
                stock: number;
                active: boolean;
            };
        } & {
            id: string;
            price: Prisma.Decimal;
            quantity: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    })[]>;
}
