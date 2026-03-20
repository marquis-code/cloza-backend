import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private auditService: AuditService,
  ) { }

  async create(name: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    let activePlan = 'FREE';
    let subscriptionData: any = undefined;

    if (user && user.trialPlan && user.trialEndsAt && user.trialEndsAt > new Date()) {
      activePlan = user.trialPlan.toUpperCase();
      subscriptionData = {
        create: {
          plan: user.trialPlan.toLowerCase(),
          status: 'trialing',
          currentPeriodEnd: user.trialEndsAt,
        }
      };
    }

    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        plan: activePlan,
        members: {
          create: {
            userId,
            role: UserRole.OWNER,
          },
        },
        ...(subscriptionData && { subscription: subscriptionData }),
      },
      include: {
        members: true,
        subscription: true,
      },
    });

    await this.auditService.logAction({
      action: 'WORKSPACE_CREATED',
      entityType: 'WORKSPACE',
      workspaceId: workspace.id,
      entityId: workspace.id,
      userId: userId,
      details: {
        name: workspace.name,
      }
    });

    if (subscriptionData) {
      // Log the subscription creation
      await this.auditService.logAction({
        action: 'SUBSCRIPTION_TRIAL_STARTED',
        entityType: 'SUBSCRIPTION',
        workspaceId: workspace.id,
        entityId: workspace.id,
        userId: userId,
        details: {
          plan: activePlan,
        }
      });

      // Clear trial data so it's not reused on another workspace
      await this.prisma.user.update({
        where: { id: userId },
        data: { trialPlan: null, trialEndsAt: null },
      });
    }

    return workspace;
  }

  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                phoneNumber: true,
              },
            },
          },
        },
        payoutAccounts: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: UserRole = UserRole.MEMBER,
  ) {
    const member = await this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
      include: {
        user: true,
        workspace: true,
      }
    });

    // Send invitation/welcome to workspace email
    await this.mailerService.sendWorkspaceInvitation(
      member.user.email,
      'A Team Member', // Ideally we'd pass the inviter's name
      member.workspace.name,
      `https://app.cloza.io/workspaces/${workspaceId}`
    );

    return member;
  }
}
