import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { AuditService } from '../audit/audit.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailerService;
    private firebaseService;
    private auditService;
    constructor(usersService: UsersService, jwtService: JwtService, mailerService: MailerService, firebaseService: FirebaseService, auditService: AuditService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        message: string;
        requiresVerification: boolean;
        email: any;
    }>;
    verifyLogin(email: string, code: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            avatarUrl: string | null;
            isOnboarded: boolean;
        };
    }>;
    register(data: any): Promise<{
        message: string;
        email: string;
        error: string;
    } | {
        message: string;
        email: string;
        error?: undefined;
    }>;
    googleLogin(idToken: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            avatarUrl: string | null;
            isOnboarded: boolean;
        };
    }>;
    verifyEmail(email: string, code: string): Promise<{
        message: string;
        requiresVerification: boolean;
        email: any;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: any): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
        email: string;
    }>;
}
