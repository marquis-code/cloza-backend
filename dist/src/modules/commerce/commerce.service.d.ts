import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
export declare class CommerceService {
    private prisma;
    private mailerService;
    constructor(prisma: PrismaService, mailerService: MailerService);
    createProduct(workspaceId: string, data: Prisma.ProductCreateWithoutWorkspaceInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        type: import("@prisma/client").$Enums.ProductType;
        stock: number;
        active: boolean;
    }>;
    getProducts(workspaceId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        type: import("@prisma/client").$Enums.ProductType;
        stock: number;
        active: boolean;
    }[]>;
    findOrCreateCustomer(workspaceId: string, data: Prisma.CustomerUncheckedCreateInput): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        platform: import("@prisma/client").$Enums.Platform | null;
        phone: string | null;
        platformCustomerId: string | null;
    }>;
    createOrder(workspaceId: string, customerId: string, itemIds: string[], sourcePostId?: string): Promise<{
        workspace: {
            members: ({
                user: {
                    id: string;
                    email: string;
                    name: string | null;
                    password: string;
                    avatarUrl: string | null;
                    phoneNumber: string | null;
                    emailVerified: boolean;
                    isOnboarded: boolean;
                    verificationCode: string | null;
                    verificationCodeExpiresAt: Date | null;
                    passwordResetToken: string | null;
                    passwordResetTokenExpiresAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    trialPlan: string | null;
                    trialEndsAt: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                workspaceId: string;
                userId: string;
                role: import("@prisma/client").$Enums.UserRole;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            plan: string;
            businessCategory: string | null;
            businessLocation: string | null;
            defaultCurrency: string;
            paymentConfirmationMessage: string | null;
            followUpReminders: boolean;
            newBuyerAlerts: boolean;
        };
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            platform: import("@prisma/client").$Enums.Platform | null;
            phone: string | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                workspaceId: string;
                currency: string;
                description: string | null;
                price: Prisma.Decimal;
                imageUrl: string | null;
                type: import("@prisma/client").$Enums.ProductType;
                stock: number;
                active: boolean;
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
        workspaceId: string;
        customerId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        currency: string;
        paymentLink: string | null;
        paidAt: Date | null;
        sourcePostId: string | null;
    }>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        currency: string;
        paymentLink: string | null;
        paidAt: Date | null;
        sourcePostId: string | null;
    }>;
    getOrders(workspaceId: string): Promise<({
        customer: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            platform: import("@prisma/client").$Enums.Platform | null;
            phone: string | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                workspaceId: string;
                currency: string;
                description: string | null;
                price: Prisma.Decimal;
                imageUrl: string | null;
                type: import("@prisma/client").$Enums.ProductType;
                stock: number;
                active: boolean;
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
        workspaceId: string;
        customerId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: Prisma.Decimal;
        currency: string;
        paymentLink: string | null;
        paidAt: Date | null;
        sourcePostId: string | null;
    })[]>;
}
