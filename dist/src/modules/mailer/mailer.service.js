"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailerService = class MailerService {
    configService;
    resend;
    fromEmail;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
        }
        else {
            console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
        }
        this.fromEmail = 'Cloza <onboarding@resend.dev>';
    }
    renderBaseTemplate(title, content, actionText, actionLink) {
        const actionButton = actionText && actionLink ? `
      <div style="text-align: center; margin: 35px 0;">
        <a href="${actionLink}" style="background-color: #000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          ${actionText}
        </a>
      </div>
    ` : '';
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f9f9fb; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { padding: 40px 40px 20px; text-align: left; }
          .logo { font-size: 24px; font-weight: 800; color: #000; letter-spacing: -1px; }
          .content { padding: 0 40px 40px; }
          .footer { padding: 30px 40px; background: #fafafa; border-top: 1px solid #f0f0f0; text-align: center; font-size: 13px; color: #888; }
          h1 { font-size: 24px; font-weight: 700; color: #000; margin-bottom: 24px; }
          p { margin-bottom: 20px; font-size: 16px; color: #444; }
          .code-box { background: #f4f4f7; padding: 24px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #000; margin: 30px 0; border: 1px solid #e1e1e8; }
          .divider { height: 1px; background: #eee; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CLOZA</div>
          </div>
          <div class="content">
            <h1>${title}</h1>
            ${content}
            ${actionButton}
          </div>
          <div class="footer">
            <p style="margin: 0;">&copy; 2024 Cloza. All rights reserved.</p>
            <p style="margin: 10px 0 0;">Lagos, Nigeria &bull; <a href="#" style="color: #888;">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    async sendVerificationEmail(email, code) {
        const html = this.renderBaseTemplate('Verify your email', `<p>Welcome to Cloza! Please use the following code to verify your email address and get started.</p>
       <div class="code-box">${code}</div>
       <p style="font-size: 14px; color: #666;">This code will expire in 15 minutes. If you didn't create an account, you can safely ignore this email.</p>`);
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: 'Verify Your Email - Cloza',
            html,
        });
    }
    async sendLoginCodeEmail(email, code) {
        const html = this.renderBaseTemplate('Login Code', `<p>Use the code below to complete your login to your Cloza account.</p>
       <div class="code-box">${code}</div>
       <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. If you didn't request this, please secure your account.</p>`);
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: 'Login Verification Code - Cloza',
            html,
        });
    }
    async sendPasswordResetEmail(email, token) {
        const resetLink = `https://app.cloza.io/reset-password?token=${token}`;
        const html = this.renderBaseTemplate('Reset Password', `<p>We received a request to reset your password. Click the button below to set a new password for your account.</p>`, 'Reset Password', resetLink);
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: 'Reset Your Password - Cloza',
            html,
        });
    }
    async sendWelcomeEmail(email, name) {
        const html = this.renderBaseTemplate(`Welcome to Cloza, ${name}!`, `<p>Your account is now fully set up and ready to go. Cloza helps you manage your business across all social platforms seamlessly.</p>
       <p>Start by connecting your first social account to begin tracking engagement and managing orders.</p>`, 'Go to Dashboard', 'https://app.cloza.io/dashboard');
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: 'Welcome to Cloza!',
            html,
        });
    }
    async sendWorkspaceInvitation(email, inviterName, workspaceName, inviteLink) {
        const html = this.renderBaseTemplate('Join the Team', `<p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace on Cloza.</p>
       <p>Collaborate with your team to manage social posts, engage with customers, and track business metrics.</p>`, 'Accept Invitation', inviteLink);
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: `Invite to join ${workspaceName} - Cloza`,
            html,
        });
    }
    async sendOrderConfirmation(email, customerName, orderId, amount, items) {
        const itemsHtml = items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
        <span>${item.name} x ${item.quantity}</span>
        <span>${item.price}</span>
      </div>
    `).join('');
        const html = this.renderBaseTemplate('Order Confirmed', `<p>Hi ${customerName}, thank you for your order! We've received your payment and are processing it now.</p>
       <div style="background: #f9f9fb; padding: 20px; border-radius: 8px; margin: 20px 0;">
         <p style="margin: 0 0 10px; font-weight: 600;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
         <div class="divider" style="margin: 15px 0;"></div>
         ${itemsHtml}
         <div class="divider" style="margin: 15px 0;"></div>
         <div style="display: flex; justify-content: space-between; font-weight: 700;">
           <span>Total</span>
           <span>${amount}</span>
         </div>
       </div>`, 'Track Order', `https://app.cloza.io/orders/${orderId}`);
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: `Your Order Confirmation - ${orderId.slice(0, 8).toUpperCase()}`,
            html,
        });
    }
    async sendNewBuyerAlert(email, merchantName, orderAmount, platform) {
        const html = this.renderBaseTemplate('New Sale Alert!', `<p>Hi ${merchantName}, you just made a new sale on <strong>${platform}</strong>!</p>
       <p>A new order with a value of <strong>${orderAmount}</strong> has been created. Log in to your dashboard to manage the fulfillment.</p>`, 'View Order', 'https://app.cloza.io/dashboard/orders');
        return this.sendEmail({
            from: this.fromEmail,
            to: [email],
            subject: 'New Sale Alert! 💰',
            html,
        });
    }
    async sendEmail(options) {
        if (!this.resend) {
            console.error('Resend is not initialized. Cannot send email:', options.subject);
            return null;
        }
        try {
            return await this.resend.emails.send(options);
        }
        catch (error) {
            console.error(`Failed to send email to ${options.to}:`, error);
            throw error;
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map