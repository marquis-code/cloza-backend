import { PaymentsService } from '../payments.service';
export declare class PaystackWebhookController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    handle(body: any, signature: string): Promise<{
        status: string;
    }>;
}
