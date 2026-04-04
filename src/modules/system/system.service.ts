import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MessageCategory } from '@prisma/client';

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);
  private configCache: Map<string, any> = new Map();

  constructor(private prisma: PrismaService) {}

  // --- Pricing Config ---

  async getPricing() {
    return this.prisma.pricingConfig.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async updatePricing(category: MessageCategory, price: number) {
    this.logger.log(`Updating pricing for ${category} to ${price}`);
    return this.prisma.pricingConfig.upsert({
      where: { category },
      update: { price },
      create: { category, price },
    });
  }

  // --- System Config ---

  async getSystemConfigs() {
    return this.prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateSystemConfig(key: string, value: string, type: string = 'string') {
    this.logger.log(`Updating system config ${key} to ${value} (type: ${type})`);
    const result = await this.prisma.systemConfig.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type },
    });
    
    // Invalidate cache
    this.configCache.delete(key);
    return result;
  }

  async getSystemConfig<T>(key: string, defaultValue: T): Promise<T> {
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    const config = await this.prisma.systemConfig.findUnique({
      where: { key },
    });

    if (!config) return defaultValue;

    let value: any = config.value;
    if (config.type === 'number') value = Number(config.value);
    if (config.type === 'json') {
        try {
            value = JSON.parse(config.value);
        } catch (e) {
            value = defaultValue;
        }
    }
    if (config.type === 'boolean') value = config.value === 'true';

    this.configCache.set(key, value);
    return value;
  }

  // --- Platform Overview ---

  async getUsers(skip = 0, take = 50) {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          isOnboarded: true,
          emailVerified: true,
      }
    });
  }

  async getWorkspaces(skip = 0, take = 50) {
    return this.prisma.workspace.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
          _count: {
              select: { members: true, conversations: true, orders: true }
          }
      }
    });
  }
}
