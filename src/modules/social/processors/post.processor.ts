import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Processor('post-publishing')
export class PostProcessor extends WorkerHost {
  private readonly logger = new Logger(PostProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { postId, targetId } = job.data;

    this.logger.log(`Publishing post ${postId} for target ${targetId}`);

    try {
      // 1. Fetch post and target details
      const target = await this.prisma.postTarget.findUnique({
        where: { id: targetId },
        include: { post: true },
      });

      if (!target) return;

      // 2. Mock API Call to Platform (Meta/TikTok/etc)
      this.logger.log(
        `Calling ${target.platform} API for post: ${target.post.content}`,
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Update Status to PUBLISHED
      await this.prisma.postTarget.update({
        where: { id: targetId },
        data: {
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });

      // 4. Update parent post status if all targets are done
      const remainingTargets = await this.prisma.postTarget.count({
        where: { postId, NOT: { status: PostStatus.PUBLISHED } },
      });

      if (remainingTargets === 0) {
        await this.prisma.post.update({
          where: { id: postId },
          data: { status: PostStatus.PUBLISHED },
        });
      }

      this.logger.log(
        `Successfully published post ${postId} to ${target.platform}`,
      );
    } catch (error) {
      this.logger.error(`Failed to publish post ${postId}: ${error.message}`);

      await this.prisma.postTarget.update({
        where: { id: targetId },
        data: {
          status: PostStatus.FAILED,
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }
}
