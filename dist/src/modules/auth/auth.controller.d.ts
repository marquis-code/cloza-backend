import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        email: string;
        error: string;
    } | {
        message: string;
        email: string;
        error?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        requiresVerification: boolean;
        email: any;
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
    verifyEmail(body: {
        email: string;
        code: string;
    }): Promise<{
        message: string;
        requiresVerification: boolean;
        email: any;
    }>;
    verifyLogin(body: {
        email: string;
        code: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            avatarUrl: string | null;
            isOnboarded: boolean;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: any;
    }): Promise<{
        message: string;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        message: string;
        email: string;
    }>;
}
