import { PrismaService } from '../../../common/prisma/prisma.service';
export declare class ComplianceService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    trackOptIn(conversationId: string, status: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        platform: import("@prisma/client").$Enums.Platform;
        lastUserMessageAt: Date | null;
        optInStatus: boolean;
        qualityRating: string | null;
        relatedOrderId: string | null;
        relatedCartId: string | null;
    }>;
    monitorQualityRating(workspaceId: string, rating: string): Promise<{
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
    }>;
    deleteUserData(platformCustomerId: string): Promise<void>;
}
