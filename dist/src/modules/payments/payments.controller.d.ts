import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initialize(orderId: string): Promise<{
        paymentLink: any;
    }>;
}
