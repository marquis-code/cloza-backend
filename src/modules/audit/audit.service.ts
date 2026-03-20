import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(data: {
    action: string;
    entityType: string;
    userId?: string;
    workspaceId?: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data,
      });
    } catch (error) {
      // Don't throw error to prevent interrupting the main business logic
      this.logger.error(`Failed to create audit log for action: ${data.action}`, error.stack);
    }
  }

  async findAll(query?: any) {
    const { skip = 0, take = 50, action, entityType, workspaceId, userId } = query || {};
    
    const where: any = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (workspaceId) where.workspaceId = workspaceId;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: Number(skip),
        take: Number(take),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          workspace: { select: { name: true } },
        }
      }),
      this.prisma.auditLog.count({ where })
    ]);

    return { data, total, skip: Number(skip), take: Number(take) };
  }
}
