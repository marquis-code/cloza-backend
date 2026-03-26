import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomInt } from 'crypto';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private firebaseService: FirebaseService,
    private auditService: AuditService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email first.');
    }

    // Generate 6-digit login verification code (2FA)
    const verificationCode = randomInt(100000, 999999).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

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

  async verifyLogin(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
      throw new BadRequestException('Verification code expired');
    }

    // Clear the code after successful login verification
    await this.usersService.update(user.id, {
      verificationCode: null,
      verificationCodeExpiresAt: null,
    });

    const payload = { email: user.email, sub: user.id };
    return {
      message: 'Welcome back!',
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

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Generate 6-digit verification code
    const verificationCode = randomInt(100000, 999999).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Map selected plan to trial plan
    let trialPlan = 'pro'; // Default to Pro for Free or Pro selections
    if (data.plan && (data.plan.toLowerCase() === 'business')) {
      trialPlan = 'business';
    }

    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const { plan, ...userData } = data;
    const user = await this.usersService.create({
      ...userData,
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
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // We don't throw here to avoid 500. The user is created, but they might need to resend the code.
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

  async googleLogin(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      const email = decodedToken.email;
      const name = decodedToken.name;
      const picture = decodedToken.picture;

      if (!email) {
        throw new BadRequestException('Email not provided in Google token');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // Create user if they don't exist
        const trialPlan = 'pro';
        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
        
        user = await this.usersService.create({
          email,
          name: name || email.split('@')[0],
          avatarUrl: picture,
          emailVerified: true,
          isOnboarded: false,
          password: randomBytes(16).toString('hex'), // Random password for social users
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

        // Send welcome email for new social users
        await this.mailerService.sendWelcomeEmail(user.email, user.name || 'there');
      } else if (!user.emailVerified) {
        // Automatically verify email if they login via Google
        await this.usersService.update(user.id, { emailVerified: true });
        
        // Send welcome email after first-time social verification
        await this.mailerService.sendWelcomeEmail(user.email, user.name || 'there');
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
    } catch (error) {
      console.error('Google login failed:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
      throw new BadRequestException('Verification code expired');
    }

    const updatedUser = await this.usersService.update(user.id, {
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null,
    });

    // Send welcome email after successful manual verification
    await this.mailerService.sendWelcomeEmail(updatedUser.email, updatedUser.name || 'there');

    return {
      message: 'Your email has been verified successfully. Please proceed to login.',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal user existence for security, but since it's a internal tool/specific request, we can be more direct
      // Or just say "If an account exists, an email has been sent"
      return { message: 'If an account exists, an email has been sent.' };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.update(user.id, {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: expiresAt,
    });

    await this.mailerService.sendPasswordResetEmail(email, token);

    return { message: 'Password reset email sent.' };
  }

  async resetPassword(token: string, newPassword: any) {
    // Find user by token
    // This is a bit tricky with Prisma findUnique if it's not indexed, but let's assume we can search
    // Better to have a dedicated method in UsersService for this
    const user = await this.usersService.findByResetToken(token);
    
    if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.usersService.update(user.id, {
      password: newPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    });

    return { message: 'Password reset successful.' };
  }

  async resendVerificationEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(sanitizedEmail);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new 6-digit verification code
    const verificationCode = randomInt(100000, 999999).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    try {
      await this.usersService.update(user.id, {
        verificationCode,
        verificationCodeExpiresAt,
      });

      const emailResult = await this.mailerService.sendVerificationEmail(user.email, verificationCode);
      if (!emailResult) {
        throw new Error('Failed to send email via MailerService');
      }
    } catch (error) {
      this.logger.error(`Resend verification failed for ${sanitizedEmail}: ${error.message}`);
      throw new BadRequestException('Failed to resend verification email. Please try again later.');
    }

    return {
      message: 'Verification code resent. Please check your email.',
      email: user.email,
    };
  }
}
