import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ConversationsService } from '../conversations.service';
export declare class FollowUpProcessor extends WorkerHost {
    private prisma;
    private conversationsService;
    private readonly logger;
    constructor(prisma: PrismaService, conversationsService: ConversationsService);
    process(job: Job<any, any, string>): Promise<any>;
    private getFollowUpContent;
}
