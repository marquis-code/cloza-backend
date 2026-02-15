import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Platform, PostStatus } from '@prisma/client';

@Injectable()
export class SocialService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('post-publishing') private postQueue: Queue,
    ) { }

    async createPost(workspaceId: string, content: string, mediaUrls: string[], targets: { platform: Platform; scheduledFor: Date }[]) {
        const post = await this.prisma.post.create({
            data: {
                workspaceId,
                content,
                mediaUrls,
                status: PostStatus.SCHEDULED,
                targets: {
                    create: targets.map((t) => ({
                        platform: t.platform,
                        scheduledFor: t.scheduledFor,
                        status: PostStatus.SCHEDULED,
                    })),
                },
            },
            include: {
                targets: true,
            },
        });

        // Add to queue for each target
        for (const target of post.targets) {
            const delay = new Date(target.scheduledFor).getTime() - Date.now();
            await this.postQueue.add(
                'publish-post',
                { postId: post.id, targetId: target.id },
                { delay: delay > 0 ? delay : 0, jobId: target.id },
            );
        }

        return post;
    }

    async getPosts(workspaceId: string) {
        return this.prisma.post.findMany({
            where: { workspaceId },
            include: { targets: true, metrics: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async linkAccount(workspaceId: string, data: any) {
        return this.prisma.socialAccount.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }

    async getMetrics(workspaceId: string) {
        return this.prisma.engagementMetric.findMany({
            where: { post: { workspaceId } },
            include: { post: true },
        });
    }
}
