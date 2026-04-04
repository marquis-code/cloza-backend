import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';
import { SystemService } from '../../system/system.service';

@Injectable()
export class BillingEngineService {
  private readonly logger = new Logger(BillingEngineService.name);

  // Hardcoded pricing tiers (Fallbacks)
  private readonly pricing = {
    [MessageCategory.SERVICE]: 0.00,
    [MessageCategory.UTILITY]: 0.05,
    [MessageCategory.MARKETING]: 0.10,
  };

  constructor(
    private prisma: PrismaService,
    private systemService: SystemService,
  ) {}

  async calculateMessageCost(workspaceId: string, customerId: string, category: MessageCategory, orderId?: string): Promise<number> {
    const config = await this.prisma.pricingConfig.findUnique({
      where: { category }
    });

    // Use DB price if available, otherwise fallback to hardcoded defaults
    let cost = config ? Number(config.price) : this.pricing[category];

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

      const limit = await this.systemService.getSystemConfig('billing_utility_limit', 3);
      if (utilityCount >= limit) {
        const surcharge = await this.systemService.getSystemConfig('billing_utility_surcharge', 0.02);
        // Charge extra if over limit
        this.logger.log(`Utility limit exceeded for order ${orderId} (${utilityCount}/${limit}). Charging extra.`);
        cost += surcharge;
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
