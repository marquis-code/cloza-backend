import { PrismaService } from '../../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';
export declare class BillingEngineService {
    private prisma;
    private readonly logger;
    private readonly pricing;
    private readonly UTILITY_LIMIT_PER_ORDER;
    constructor(prisma: PrismaService);
    calculateMessageCost(workspaceId: string, customerId: string, category: MessageCategory, orderId?: string): Promise<number>;
    trackCustomerMessageRatio(workspaceId: string, customerId: string): Promise<{
        total: number;
        distribution: any;
    }>;
}
