import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private resend: Resend;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not defined. Email sending will be disabled.');
    } else {
      this.resend = new Resend(apiKey);
    }
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'Cloza <noreply@getcloza.com>';
  }

  public brandWrapper(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
          
          body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', 'Inter', -apple-system, sans-serif; }
          .email-wrapper { background-color: #f8fafc; padding: 40px 15px; }
          .container { 
            background-color: #ffffff; 
            max-width: 580px; 
            margin: 0 auto; 
            border-radius: 32px; 
            padding: 48px 40px; 
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05); 
            border: 1px solid #e2e8f0;
          }
          .logo { text-align: center; margin-bottom: 40px; font-size: 28px; font-weight: 800; color: #000; letter-spacing: -1px; }
          
          .header { text-align: center; margin-bottom: 32px; }
          .title-pill {
            display: inline-block;
            padding: 8px 16px;
            background: #f1f5f9;
            border-radius: 100px;
            margin-bottom: 16px;
          }
          .title-pill span {
            color: #64748b;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .title { color: #0f172a; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.03em; line-height: 1.2; }
          
          .content { font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 40px; }
          .content p { margin-bottom: 20px; }
          .content strong { color: #1e293b; font-weight: 600; }
          
          .action-area { text-align: center; margin: 40px 0; }
          .btn { 
            display: inline-block; 
            padding: 16px 36px; 
            background: #000000;
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 16px; 
            font-weight: 700; 
            font-size: 15px; 
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.2);
          }
          
          .otp-card { 
            background: #f8fafc; 
            border-radius: 24px; 
            padding: 32px; 
            text-align: center; 
            margin: 32px 0; 
            border: 2px dashed #e2e8f0; 
          }
          .otp-label { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; display: block; }
          .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #0f172a; font-family: 'Outfit', monospace; }
          
          .footer { 
            text-align: center; 
            padding: 32px 0 0;
            border-top: 1px solid #f1f5f9;
            margin-top: 40px;
          }
          .footer-text { font-size: 13px; color: #94a3b8; line-height: 1.6; }
          .footer-brand { font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="logo">CLOZA</div>
            <div class="header">
              <div class="title-pill"><span>System Notification</span></div>
              <h1 class="title">${title}</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <div class="footer-brand">Cloza Technologies</div>
              <div class="footer-text">
                &copy; ${new Date().getFullYear()} • Elevate Your Business. Seamlessly.<br>
                Lagos, Nigeria.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendVerificationEmail(email: string, code: string) {
    const subject = 'Verify Your Email - Cloza';
    const html = this.brandWrapper(
      'Verify Your Identity',
      `
      <p>Welcome to Cloza! Please use the following code to verify your email address and complete your registration.</p>
      <div class="otp-card">
        <span class="otp-label">Verification Code</span>
        <span class="otp-code">${code}</span>
      </div>
      <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your Cloza verification code is: ${code}`,
    });
  }

  async sendLoginCodeEmail(email: string, code: string) {
    const subject = 'Login Verification Code - Cloza';
    const html = this.brandWrapper(
      'Security Verification',
      `
      <p>Use the following code to complete your login to Cloza.</p>
      <div class="otp-card">
        <span class="otp-label">Login Code</span>
        <span class="otp-code">${code}</span>
      </div>
      <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 5 minutes. If this wasn't you, please secure your account immediately.</p>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your Cloza login code is: ${code}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `https://app.cloza.io/reset-password?token=${token}`;
    const subject = 'Reset Your Password - Cloza';
    const html = this.brandWrapper(
      'Reset Password',
      `
      <p>We received a request to reset your password. Click the button below to set a new password for your account.</p>
      <div class="action-area">
        <a href="${resetLink}" class="btn">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 14px; color: #64748b; word-break: break-all;">${resetLink}</p>
      <p style="font-size: 14px; color: #64748b;">This link will expire in 1 hour.</p>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Reset your Cloza password here: ${resetLink}`,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Welcome to Cloza! 🚀';
    const html = this.brandWrapper(
      `Welcome, ${name}!`,
      `
      <p>Your account is now fully set up and ready to go! Cloza helps you manage your business across all social platforms seamlessly.</p>
      <p>Start by connecting your first social account to begin tracking engagement and managing orders.</p>
      <div class="action-area">
        <a href="https://app.cloza.io/dashboard" class="btn">Go to Dashboard</a>
      </div>
      <p>We're excited to have you on board!</p>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Welcome to Cloza, ${name}! Your account is ready.`,
    });
  }

  async sendWorkspaceInvitation(email: string, inviterName: string, workspaceName: string, inviteLink: string) {
    const subject = `Join the ${workspaceName} Team - Cloza`;
    const html = this.brandWrapper(
      'You\'re Invited!',
      `
      <p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace on Cloza.</p>
      <p>Collaborate with your team to manage social posts, engage with customers, and track business metrics.</p>
      <div class="action-area">
        <a href="${inviteLink}" class="btn">Accept Invitation</a>
      </div>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `${inviterName} invited you to join ${workspaceName} on Cloza. Accept here: ${inviteLink}`,
    });
  }

  async sendOrderConfirmation(email: string, customerName: string, orderId: string, amount: string, items: any[]) {
    const itemsHtml = items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        <span style="color: #475569;">${item.name} x ${item.quantity}</span>
        <span style="font-weight: 600; color: #1e293b;">${amount}</span>
      </div>
    `).join('');

    const subject = `Your Order Confirmation - ${orderId.slice(0, 8).toUpperCase()}`;
    const html = this.brandWrapper(
      'Order Confirmed',
      `
      <p>Hi ${customerName}, thank you for your order! We've received your payment and are processing it now.</p>
      <div style="background: #f8fafc; padding: 24px; border-radius: 20px; margin: 24px 0; border: 1px solid #e1e1e8;">
        <p style="margin: 0 0 16px; font-weight: 700; color: #0f172a; font-size: 14px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
        ${itemsHtml}
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 18px; margin-top: 16px; color: #0f172a;">
          <span>Total</span>
          <span>${amount}</span>
        </div>
      </div>
      <div class="action-area">
        <a href="https://app.cloza.io/orders/${orderId}" class="btn">Track Order</a>
      </div>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendNewBuyerAlert(email: string, merchantName: string, orderAmount: string, platform: string) {
    const subject = 'New Sale Alert! 💰';
    const html = this.brandWrapper(
      'New Sale!',
      `
      <p>Hi ${merchantName}, you just made a new sale on <strong>${platform}</strong>!</p>
      <p>A new order with a value of <strong>${orderAmount}</strong> has been created. Log in to your dashboard to manage the fulfillment.</p>
      <div class="action-area">
        <a href="https://app.cloza.io/dashboard/orders" class="btn">View Order</a>
      </div>
      `
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendEmail(options: { to: string | string[], subject: string, html: string, text?: string }) {
    if (!this.resend) {
      this.logger.error(`Resend is not initialized. Cannot send email: ${options.subject}`);
      return null;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });

      if (error) {
        this.logger.error(`Resend Error: ${JSON.stringify(error)}`);
        return null;
      }

      return data;
    } catch (err) {
      this.logger.error(`Mail Exception: ${err.message}`);
      return null;
    }
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim();
  }
}

