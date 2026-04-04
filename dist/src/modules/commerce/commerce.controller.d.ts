import { CommerceService } from './commerce.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class CommerceController {
    private commerceService;
    constructor(commerceService: CommerceService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
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
        price: import("@prisma/client-runtime-utils").Decimal;
        imageUrl: string | null;
        type: import("@prisma/client").$Enums.ProductType;
        stock: number;
        active: boolean;
    }[]>;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
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
                    role: import("@prisma/client").$Enums.UserRole;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                role: import("@prisma/client").$Enums.UserRole;
                workspaceId: string;
                userId: string;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                imageUrl: string | null;
                type: import("@prisma/client").$Enums.ProductType;
                stock: number;
                active: boolean;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
                imageUrl: string | null;
                type: import("@prisma/client").$Enums.ProductType;
                stock: number;
                active: boolean;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
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
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        paymentLink: string | null;
        paidAt: Date | null;
        sourcePostId: string | null;
    })[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        paymentLink: string | null;
        paidAt: Date | null;
        sourcePostId: string | null;
    }>;
}
