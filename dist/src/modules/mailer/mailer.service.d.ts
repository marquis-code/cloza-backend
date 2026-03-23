import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private configService;
    private readonly logger;
    private resend;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    brandWrapper(title: string, content: string): string;
    sendVerificationEmail(email: string, code: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendLoginCodeEmail(email: string, code: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendPasswordResetEmail(email: string, token: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendWelcomeEmail(email: string, name: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendWorkspaceInvitation(email: string, inviterName: string, workspaceName: string, inviteLink: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendOrderConfirmation(email: string, customerName: string, orderId: string, amount: string, items: any[]): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendNewBuyerAlert(email: string, merchantName: string, orderAmount: string, platform: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
    sendEmail(options: {
        to: string | string[];
        subject: string;
        html: string;
        text?: string;
    }): Promise<import("resend").CreateEmailResponseSuccess | null>;
    private stripHtml;
}
