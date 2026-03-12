import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class CommerceService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // Products
  async createProduct(
    workspaceId: string,
    data: Prisma.ProductCreateWithoutWorkspaceInput,
  ) {
    return this.prisma.product.create({
      data: {
        ...data,
        workspaceId,
      },
    });
  }

  async getProducts(workspaceId: string) {
    return this.prisma.product.findMany({
      where: { workspaceId, active: true },
    });
  }

  // Customers
  async findOrCreateCustomer(
    workspaceId: string,
    data: Prisma.CustomerUncheckedCreateInput,
  ) {
    const existing = await this.prisma.customer.findFirst({
      where: {
        workspaceId,
        OR: [
          { email: data.email },
          { phone: data.phone },
          { platformCustomerId: data.platformCustomerId },
        ].filter(Boolean) as any,
      },
    });

    if (existing) return existing;

    return this.prisma.customer.create({
      data: {
        ...data,
        workspaceId,
      },
    });
  }

  // Orders
  async createOrder(
    workspaceId: string,
    customerId: string,
    itemIds: string[],
    sourcePostId?: string,
  ) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: itemIds }, workspaceId },
    });

    const totalAmount = products.reduce((acc, p) => acc + Number(p.price), 0);

    const order = await this.prisma.order.create({
      data: {
        workspaceId,
        customerId,
        sourcePostId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: p.price,
            quantity: 1, // Defaulting to 1 for MVP
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          }
        },
        customer: true,
        workspace: {
          include: {
            members: {
              where: { role: 'OWNER' },
              include: { user: true }
            }
          }
        }
      },
    });

    // Send customer confirmation
    if (order.customer.email) {
      await this.mailerService.sendOrderConfirmation(
        order.customer.email,
        order.customer.name,
        order.id,
        `${order.totalAmount} ${order.currency}`,
        order.items.map(i => ({ name: i.product.name, quantity: i.quantity, price: `${i.price} ${order.currency}` }))
      );
    }

    // Send merchant alert
    const owners = order.workspace.members;
    for (const owner of owners) {
      await this.mailerService.sendNewBuyerAlert(
        owner.user.email,
        owner.user.name || 'Merchant',
        `${order.totalAmount} ${order.currency}`,
        'Cloza Checkout'
      );
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getOrders(workspaceId: string) {
    return this.prisma.order.findMany({
      where: { workspaceId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
