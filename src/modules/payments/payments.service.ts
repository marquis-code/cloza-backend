import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, MessageFormat, SenderType, Platform } from '@prisma/client';
import { ConversationsService } from '../conversations/conversations.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private conversationsService: ConversationsService,
    private mailerService: MailerService,
  ) { }

  async createPaymentLink(orderId: string, conversationId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) throw new Error('Order not found');

    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email: order.customer.email || 'customer@cloza.com',
          amount: Math.round(Number(order.totalAmount) * 100), // Paystack uses kobo/cents
          reference: order.id,
          callback_url: `${this.configService.get('FRONTEND_URL')}/payment/callback`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paymentLink = response.data.data.authorization_url;

      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentLink },
      });

      // Integrate with Chat
      if (conversationId) {
        await this.conversationsService.sendMessage(
          order.workspaceId, // System/User ID
          SenderType.USER,
          {
            conversationId,
            content: `Here's the payment link for your order: ${paymentLink}`,
            format: MessageFormat.PAYMENT_LINK,
            payload: { orderId, paymentLink },
          },
        );
      }

      return { paymentLink };
    } catch (error) {
      this.logger.error(`Paystack Initialization Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  }

  // Payout Accounts
  async addPayoutAccount(workspaceId: string, data: { bankName: string; accountNumber: string }) {
    return this.prisma.payoutAccount.create({
      data: {
        ...data,
        workspaceId,
        isDefault: true, // Auto-set first one as default
      },
    });
  }

  async getPayoutAccounts(workspaceId: string) {
    return this.prisma.payoutAccount.findMany({
      where: { workspaceId },
    });
  }

  async handleWebhook(body: any, signature: string) {
    // In production, verify signature here using crypto
    const event = body.event;
    const reference = body.data.reference;

    if (event === 'charge.success') {
      const order = await this.prisma.order.update({
        where: { id: reference },
        data: {
          status: OrderStatus.PAID,
          paidAt: new Date(),
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
          workspace: {
            include: {
              members: {
                where: { role: 'OWNER' },
                include: { user: true },
              },
            },
          },
        },
      });

      this.logger.log(`Order ${reference} marked as PAID via webhook`);

      // Send payment confirmation to customer
      if (order.customer.email) {
        await this.mailerService.sendOrderConfirmation(
          order.customer.email,
          order.customer.name,
          order.id,
          `${order.totalAmount} ${order.currency}`,
          order.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: `${i.price} ${order.currency}`,
          })),
        );
      }

      // Notify merchant/owner about the payment
      const owners = order.workspace.members;
      for (const owner of owners) {
        await this.mailerService.sendNewBuyerAlert(
          owner.user.email,
          owner.user.name || 'Merchant',
          `${order.totalAmount} ${order.currency}`,
          'Cloza Checkout'
        );
      }
    }

    return { status: 'success' };
  }
}
