import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';

@Injectable()
export class BillingEngineService {
  private readonly logger = new Logger(BillingEngineService.name);

  // Hardcoded pricing tiers
  private readonly pricing = {
    [MessageCategory.SERVICE]: 0.00,
    [MessageCategory.UTILITY]: 0.05,
    [MessageCategory.MARKETING]: 0.10,
  };

  private readonly UTILITY_LIMIT_PER_ORDER = 3;

  constructor(private prisma: PrismaService) {}

  async calculateMessageCost(workspaceId: string, customerId: string, category: MessageCategory, orderId?: string): Promise<number> {
    let cost = this.pricing[category];

    // Guardrail: Limit free/base utility messages per order
    if (category === MessageCategory.UTILITY && orderId) {
      const utilityCount = await this.prisma.message.count({
        where: {
          category: MessageCategory.UTILITY,
          conversation: {
            workspaceId,
            customerId,
            relatedOrderId: orderId,
          },
        },
      });

      if (utilityCount >= this.UTILITY_LIMIT_PER_ORDER) {
        // Charge extra if over limit
        this.logger.log(`Utility limit exceeded for order ${orderId} (${utilityCount}/${this.UTILITY_LIMIT_PER_ORDER}). Charging extra.`);
        cost += 0.02; // Extra surcharge
      }
    }

    return cost;
  }

  async trackCustomerMessageRatio(workspaceId: string, customerId: string) {
    const totalMessages = await this.prisma.message.count({
      where: {
        conversation: { workspaceId, customerId }
      }
    });

    const categoriesCount = await this.prisma.message.groupBy({
      by: ['category'],
      where: {
        conversation: { workspaceId, customerId }
      },
      _count: true
    });

    return {
      total: totalMessages,
      distribution: categoriesCount.reduce((acc, curr) => {
        acc[curr.category] = curr._count;
        return acc;
      }, {} as any)
    };
  }
}
