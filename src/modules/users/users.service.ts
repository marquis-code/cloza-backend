import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PLANS } from '../../common/constants/plans';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserFeatures(userId: string) {
    // 1. Find the user's first workspace with subscription
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
      include: {
        workspace: {
          include: { subscription: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    let activePlanId = 'starter'; // default to free

    if (membership) {
      const workspace = membership.workspace;
      const sub = workspace.subscription;

      if (sub && sub.status !== 'canceled' && sub.currentPeriodEnd && sub.currentPeriodEnd > new Date()) {
        // Active paid subscription or trial
        activePlanId = sub.plan;
      } else {
        // Fall back to workspace plan field
        activePlanId = workspace.plan.toLowerCase() === 'free' ? 'starter' : workspace.plan.toLowerCase();
      }
    } else {
      // No workspace yet — check user trial
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.trialPlan && user?.trialEndsAt && user.trialEndsAt > new Date()) {
        activePlanId = user.trialPlan;
      }
    }

    const plan = PLANS.find(p => p.id === activePlanId) || PLANS[0];

    return {
      activePlan: plan.id,
      planName: plan.name,
      features: plan.features,
      featureSlugs: plan.features_slugs || [],
      limits: plan.limits,
    };
  }
}
