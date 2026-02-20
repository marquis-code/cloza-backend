import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async createPaymentLink(orderId: string) {
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
          amount: Number(order.totalAmount) * 100, // Paystack uses kobo/cents
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

      return { paymentLink };
    } catch (error) {
      this.logger.error(`Paystack Initialization Error: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(body: any, signature: string) {
    // In production, verify signature here using crypto
    const event = body.event;
    const reference = body.data.reference;

    if (event === 'charge.success') {
      await this.prisma.order.update({
        where: { id: reference },
        data: {
          status: OrderStatus.PAID,
          paidAt: new Date(),
        },
      });
      this.logger.log(`Order ${reference} marked as PAID via webhook`);
    }

    return { status: 'success' };
  }
}
