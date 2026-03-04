import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { CreatePayoutAccountDto } from './dto/payout-account.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initialize(dto: InitializePaymentDto): Promise<{
        paymentLink: any;
    }>;
    addPayoutAccount(dto: CreatePayoutAccountDto): Promise<{
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
}
