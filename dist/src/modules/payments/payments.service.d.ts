import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MailerService } from '../mailer/mailer.service';
export declare class PaymentsService {
    private configService;
    private prisma;
    private conversationsService;
    private mailerService;
    private readonly logger;
    private readonly paystackBaseUrl;
    constructor(configService: ConfigService, prisma: PrismaService, conversationsService: ConversationsService, mailerService: MailerService);
    createPaymentLink(orderId: string, conversationId?: string): Promise<{
        paymentLink: any;
    }>;
    addPayoutAccount(workspaceId: string, data: {
        bankName: string;
        accountNumber: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        bankName: string;
        accountNumber: string;
        isDefault: boolean;
    }>;
    getPayoutAccounts(workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        bankName: string;
        accountNumber: string;
        isDefault: boolean;
    }[]>;
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
}
