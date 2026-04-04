import { PrismaService } from '../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';
export declare class SystemService {
    private prisma;
    private readonly logger;
    private configCache;
    constructor(prisma: PrismaService);
    getPricing(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.MessageCategory;
    }[]>;
    updatePricing(category: MessageCategory, price: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        category: import("@prisma/client").$Enums.MessageCategory;
    }>;
    getSystemConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
    updateSystemConfig(key: string, value: string, type?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }>;
    getSystemConfig<T>(key: string, defaultValue: T): Promise<T>;
    getUsers(skip?: number, take?: number): Promise<{
        id: string;
        email: string;
        name: string | null;
        emailVerified: boolean;
        isOnboarded: boolean;
        createdAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    getWorkspaces(skip?: number, take?: number): Promise<({
        _count: {
            orders: number;
            conversations: number;
            members: number;
        };
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
    })[]>;
}
