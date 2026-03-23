import { PrismaService } from '../../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import { AuditService } from '../audit/audit.service';
export declare class WorkspacesService {
    private prisma;
    private mailerService;
    private auditService;
    constructor(prisma: PrismaService, mailerService: MailerService, auditService: AuditService);
    create(name: string, userId: string): Promise<{
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            status: string;
            plan: string;
            paystackCustomerId: string | null;
            currentPeriodEnd: Date | null;
        } | null;
    } & {
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
    findAllForUser(userId: string): Promise<({
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
    } & {
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
    })[]>;
    findById(id: string): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                name: string | null;
                avatarUrl: string | null;
                phoneNumber: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
        })[];
        payoutAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            bankName: string;
            accountNumber: string;
            isDefault: boolean;
        }[];
    } & {
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
    }) | null>;
    update(id: string, data: any): Promise<{
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
    addMember(workspaceId: string, userId: string, role?: UserRole): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            password: string;
            avatarUrl: string | null;
            phoneNumber: string | null;
            emailVerified: boolean;
            isOnboarded: boolean;
            verificationCode: string | null;
            verificationCodeExpiresAt: Date | null;
            passwordResetToken: string | null;
            passwordResetTokenExpiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            trialPlan: string | null;
            trialEndsAt: Date | null;
        };
        workspace: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        userId: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
}
