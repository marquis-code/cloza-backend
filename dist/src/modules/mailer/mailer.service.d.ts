import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private configService;
    private resend;
    private fromEmail;
    constructor(configService: ConfigService);
    private renderBaseTemplate;
    sendVerificationEmail(email: string, code: string): Promise<import("resend").CreateEmailResponse | null>;
    sendLoginCodeEmail(email: string, code: string): Promise<import("resend").CreateEmailResponse | null>;
    sendPasswordResetEmail(email: string, token: string): Promise<import("resend").CreateEmailResponse | null>;
    sendWelcomeEmail(email: string, name: string): Promise<import("resend").CreateEmailResponse | null>;
    sendWorkspaceInvitation(email: string, inviterName: string, workspaceName: string, inviteLink: string): Promise<import("resend").CreateEmailResponse | null>;
    sendOrderConfirmation(email: string, customerName: string, orderId: string, amount: string, items: any[]): Promise<import("resend").CreateEmailResponse | null>;
    sendNewBuyerAlert(email: string, merchantName: string, orderAmount: string, platform: string): Promise<import("resend").CreateEmailResponse | null>;
    sendEmail(options: any): Promise<import("resend").CreateEmailResponse | null>;
}
