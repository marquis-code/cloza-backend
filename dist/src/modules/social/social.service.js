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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const client_1 = require("@prisma/client");
let SocialService = class SocialService {
    prisma;
    postQueue;
    constructor(prisma, postQueue) {
        this.prisma = prisma;
        this.postQueue = postQueue;
    }
    async createPost(workspaceId, content, mediaUrls, targets) {
        const post = await this.prisma.post.create({
            data: {
                workspaceId,
                content,
                mediaUrls,
                status: client_1.PostStatus.SCHEDULED,
                targets: {
                    create: targets.map((t) => ({
                        platform: t.platform,
                        scheduledFor: t.scheduledFor,
                        status: client_1.PostStatus.SCHEDULED,
                    })),
                },
            },
            include: {
                targets: true,
            },
        });
        for (const target of post.targets) {
            const delay = new Date(target.scheduledFor).getTime() - Date.now();
            await this.postQueue.add('publish-post', { postId: post.id, targetId: target.id }, { delay: delay > 0 ? delay : 0, jobId: target.id });
        }
        return post;
    }
    async getPosts(workspaceId) {
        return this.prisma.post.findMany({
            where: { workspaceId },
            include: { targets: true, metrics: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async linkAccount(workspaceId, data) {
        return this.prisma.socialAccount.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }
    async getMetrics(workspaceId) {
        return this.prisma.engagementMetric.findMany({
            where: { post: { workspaceId } },
            include: { post: true },
        });
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('post-publishing')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], SocialService);
//# sourceMappingURL=social.service.js.map