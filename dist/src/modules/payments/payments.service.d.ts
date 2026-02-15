import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
export declare class PaymentsService {
    private configService;
    private prisma;
    private readonly logger;
    private readonly paystackBaseUrl;
    constructor(configService: ConfigService, prisma: PrismaService);
    createPaymentLink(orderId: string): Promise<{
        paymentLink: any;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
}
