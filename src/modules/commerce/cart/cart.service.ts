import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, customerId: string, data: any) {
    return this.prisma.cart.create({
      data: {
        workspaceId,
        customerId,
        items: data.items,
        totalAmount: data.totalAmount,
        currency: data.currency || 'NGN',
      },
    });
  }

  async findOne(id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async update(id: string, data: any) {
    return this.prisma.cart.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.cart.delete({
      where: { id },
    });
  }

  async findByCustomer(workspaceId: string, customerId: string) {
    return this.prisma.cart.findMany({
      where: { workspaceId, customerId },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
