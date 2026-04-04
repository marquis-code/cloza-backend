import { PrismaService } from '../../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';
import { SystemService } from '../../system/system.service';
export declare class BillingEngineService {
    private prisma;
    private systemService;
    private readonly logger;
    private readonly pricing;
    constructor(prisma: PrismaService, systemService: SystemService);
    calculateMessageCost(workspaceId: string, customerId: string, category: MessageCategory, orderId?: string): Promise<number>;
    trackCustomerMessageRatio(workspaceId: string, customerId: string): Promise<{
        total: number;
        distribution: any;
    }>;
}
