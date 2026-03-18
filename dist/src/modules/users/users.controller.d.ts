import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '../mailer/mailer.service';
export declare class UsersController {
    private usersService;
    private mailerService;
    constructor(usersService: UsersService, mailerService: MailerService);
    getProfile(req: any): Promise<{
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
    } | null>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
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
    }>;
    markAsOnboarded(req: any): Promise<{
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
    }>;
}
