import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
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
}
export {};
