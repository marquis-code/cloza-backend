import { SystemService } from './system.service';
import { MessageCategory } from '@prisma/client';
export declare class SystemController {
    private readonly systemService;
    constructor(systemService: SystemService);
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
    getConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
    upsertConfig(key: string, value: string, type?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }>;
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
