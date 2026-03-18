import { PrismaService } from '../../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
export declare class WorkspacesService {
    private prisma;
    private mailerService;
    constructor(prisma: PrismaService, mailerService: MailerService);
    create(name: string, userId: string): Promise<{
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForUser(userId: string): Promise<({
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string | null;
                email: string;
                avatarUrl: string | null;
                phoneNumber: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
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
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMember(workspaceId: string, userId: string, role?: UserRole): Promise<{
        workspace: {
            id: string;
            name: string;
            plan: string;
            businessCategory: string | null;
            businessLocation: string | null;
            defaultCurrency: string;
            paymentConfirmationMessage: string | null;
            followUpReminders: boolean;
            newBuyerAlerts: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatarUrl: string | null;
            phoneNumber: string | null;
            emailVerified: boolean;
            isOnboarded: boolean;
            verificationCode: string | null;
            verificationCodeExpiresAt: Date | null;
            passwordResetToken: string | null;
            passwordResetTokenExpiresAt: Date | null;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        role: import("@prisma/client").$Enums.UserRole;
        userId: string;
    }>;
}
