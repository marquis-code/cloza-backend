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
var PostProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
let PostProcessor = PostProcessor_1 = class PostProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(PostProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { postId, targetId } = job.data;
        this.logger.log(`Publishing post ${postId} for target ${targetId}`);
        try {
            const target = await this.prisma.postTarget.findUnique({
                where: { id: targetId },
                include: { post: true },
            });
            if (!target)
                return;
            this.logger.log(`Calling ${target.platform} API for post: ${target.post.content}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.prisma.postTarget.update({
                where: { id: targetId },
                data: {
                    status: client_1.PostStatus.PUBLISHED,
                    publishedAt: new Date(),
                },
            });
            const remainingTargets = await this.prisma.postTarget.count({
                where: { postId, NOT: { status: client_1.PostStatus.PUBLISHED } },
            });
            if (remainingTargets === 0) {
                await this.prisma.post.update({
                    where: { id: postId },
                    data: { status: client_1.PostStatus.PUBLISHED },
                });
            }
            this.logger.log(`Successfully published post ${postId} to ${target.platform}`);
        }
        catch (error) {
            this.logger.error(`Failed to publish post ${postId}: ${error.message}`);
            await this.prisma.postTarget.update({
                where: { id: targetId },
                data: {
                    status: client_1.PostStatus.FAILED,
                    errorMessage: error.message,
                },
            });
            throw error;
        }
    }
};
exports.PostProcessor = PostProcessor;
exports.PostProcessor = PostProcessor = PostProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('post-publishing'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostProcessor);
//# sourceMappingURL=post.processor.js.map