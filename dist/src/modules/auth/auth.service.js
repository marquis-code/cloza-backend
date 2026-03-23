"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const mailer_service_1 = require("../mailer/mailer.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const firebase_service_1 = require("../../common/firebase/firebase.service");
const audit_service_1 = require("../audit/audit.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    mailerService;
    firebaseService;
    auditService;
    constructor(usersService, jwtService, mailerService, firebaseService, auditService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.firebaseService = firebaseService;
        this.auditService = auditService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException('Email not verified. Please verify your email first.');
        }
        const verificationCode = (0, crypto_1.randomInt)(100000, 999999).toString();
        const verificationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.usersService.update(user.id, {
            verificationCode,
            verificationCodeExpiresAt,
        });
        await this.mailerService.sendLoginCodeEmail(user.email, verificationCode);
        return {
            message: 'Login verification code sent to your email.',
            requiresVerification: true,
            email: user.email,
        };
    }
    async verifyLogin(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.verificationCode !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        await this.usersService.update(user.id, {
            verificationCode: null,
            verificationCodeExpiresAt: null,
        });
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                isOnboarded: user.isOnboarded,
            },
        };
    }
    async register(data) {
        const existingUser = await this.usersService.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const verificationCode = (0, crypto_1.randomInt)(100000, 999999).toString();
        const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        let trialPlan = 'pro';
        if (data.plan && (data.plan.toLowerCase() === 'business')) {
            trialPlan = 'business';
        }
        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const user = await this.usersService.create({
            ...data,
            verificationCode,
            verificationCodeExpiresAt,
            trialPlan,
            trialEndsAt,
        });
        await this.auditService.logAction({
            action: 'USER_REGISTERED',
            entityType: 'USER',
            userId: user.id,
            entityId: user.id,
            details: {
                method: 'email',
                requestedPlan: data.plan || 'none',
                assignedTrialPlan: trialPlan,
            },
        });
        try {
            await this.mailerService.sendVerificationEmail(user.email, verificationCode);
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
            return {
                message: 'Registration successful, but we couldn\'t send the verification email. Please try requesting a new code.',
                email: user.email,
                error: 'EMAIL_SEND_FAILED',
            };
        }
        return {
            message: 'Registration successful. Please check your email for verification code.',
            email: user.email,
        };
    }
    async googleLogin(idToken) {
        try {
            const decodedToken = await this.firebaseService.verifyIdToken(idToken);
            const email = decodedToken.email;
            const name = decodedToken.name;
            const picture = decodedToken.picture;
            if (!email) {
                throw new common_1.BadRequestException('Email not provided in Google token');
            }
            let user = await this.usersService.findByEmail(email);
            if (!user) {
                const trialPlan = 'pro';
                const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
                user = await this.usersService.create({
                    email,
                    name: name || email.split('@')[0],
                    avatarUrl: picture,
                    emailVerified: true,
                    isOnboarded: false,
                    password: (0, crypto_1.randomBytes)(16).toString('hex'),
                    trialPlan,
                    trialEndsAt,
                });
                await this.auditService.logAction({
                    action: 'USER_REGISTERED',
                    entityType: 'USER',
                    userId: user.id,
                    entityId: user.id,
                    details: {
                        method: 'google',
                        assignedTrialPlan: trialPlan,
                    },
                });
            }
            else if (!user.emailVerified) {
                await this.usersService.update(user.id, { emailVerified: true });
            }
            const payload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    isOnboarded: user.isOnboarded,
                },
            };
        }
        catch (error) {
            console.error('Google login failed:', error);
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
    }
    async verifyEmail(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.verificationCode !== code) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code expired');
        }
        await this.usersService.update(user.id, {
            emailVerified: true,
            verificationCode: null,
            verificationCodeExpiresAt: null,
        });
        return this.login(user);
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If an account exists, an email has been sent.' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.usersService.update(user.id, {
            passwordResetToken: token,
            passwordResetTokenExpiresAt: expiresAt,
        });
        await this.mailerService.sendPasswordResetEmail(email, token);
        return { message: 'Password reset email sent.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        await this.usersService.update(user.id, {
            password: newPassword,
            passwordResetToken: null,
            passwordResetTokenExpiresAt: null,
        });
        return { message: 'Password reset successful.' };
    }
    async resendVerificationEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const verificationCode = (0, crypto_1.randomInt)(100000, 999999).toString();
        const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.usersService.update(user.id, {
            verificationCode,
            verificationCodeExpiresAt,
        });
        await this.mailerService.sendVerificationEmail(user.email, verificationCode);
        return {
            message: 'Verification code resent. Please check your email.',
            email: user.email,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mailer_service_1.MailerService,
        firebase_service_1.FirebaseService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map