"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const mailer_service_1 = require("../mailer/mailer.service");
const audit_service_1 = require("../audit/audit.service");
let WorkspacesService = class WorkspacesService {
    prisma;
    mailerService;
    auditService;
    constructor(prisma, mailerService, auditService) {
        this.prisma = prisma;
        this.mailerService = mailerService;
        this.auditService = auditService;
    }
    async create(name, userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        let activePlan = 'FREE';
        let subscriptionData = undefined;
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
                        role: client_1.UserRole.OWNER,
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
            await this.prisma.user.update({
                where: { id: userId },
                data: { trialPlan: null, trialEndsAt: null },
            });
        }
        return workspace;
    }
    async findAllForUser(userId) {
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
    async findById(id) {
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
    async update(id, data) {
        return this.prisma.workspace.update({
            where: { id },
            data,
        });
    }
    async addMember(workspaceId, userId, role = client_1.UserRole.MEMBER) {
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
        await this.mailerService.sendWorkspaceInvitation(member.user.email, 'A Team Member', member.workspace.name, `https://app.cloza.io/workspaces/${workspaceId}`);
        return member;
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService,
        audit_service_1.AuditService])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map