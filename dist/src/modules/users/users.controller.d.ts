import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '../mailer/mailer.service';
export declare class UsersController {
    private usersService;
    private mailerService;
    constructor(usersService: UsersService, mailerService: MailerService);
    getProfile(req: any): Promise<{
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
    } | null>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
    markAsOnboarded(req: any): Promise<{
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
    }>;
    getMyFeatures(req: any): Promise<{
        activePlan: string;
        featureSlugs: Record<string, boolean>;
        limits: {
            socialAccounts: number;
            quickReplies: number;
            paymentLinks: number;
            scheduledPosts: number;
            teamMembers: number;
        };
    }>;
}
