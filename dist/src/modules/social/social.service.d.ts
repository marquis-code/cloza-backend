import { PrismaService } from '../../common/prisma/prisma.service';
import { Queue } from 'bullmq';
import { Platform } from '@prisma/client';
export declare class SocialService {
    private prisma;
    private postQueue;
    constructor(prisma: PrismaService, postQueue: Queue);
    createPost(workspaceId: string, content: string, mediaUrls: string[], targets: {
        platform: Platform;
        scheduledFor: Date;
    }[]): Promise<{
        targets: {
            id: string;
            platform: import("@prisma/client").$Enums.Platform;
            status: import("@prisma/client").$Enums.PostStatus;
            scheduledFor: Date;
            publishedAt: Date | null;
            errorMessage: string | null;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        mediaUrls: string[];
    }>;
    getPosts(workspaceId: string): Promise<({
        targets: {
            id: string;
            platform: import("@prisma/client").$Enums.Platform;
            status: import("@prisma/client").$Enums.PostStatus;
            scheduledFor: Date;
            publishedAt: Date | null;
            errorMessage: string | null;
            postId: string;
        }[];
        metrics: {
            comments: number;
            id: string;
            platform: import("@prisma/client").$Enums.Platform;
            postId: string;
            impressions: number;
            likes: number;
            clicks: number;
            recordedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        mediaUrls: string[];
    })[]>;
    linkAccount(workspaceId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        platform: import("@prisma/client").$Enums.Platform;
        platformAccountId: string;
        accessToken: string;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
    }>;
    getMetrics(workspaceId: string): Promise<({
        post: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            content: string;
            status: import("@prisma/client").$Enums.PostStatus;
            mediaUrls: string[];
        };
    } & {
        comments: number;
        id: string;
        platform: import("@prisma/client").$Enums.Platform;
        postId: string;
        impressions: number;
        likes: number;
        clicks: number;
        recordedAt: Date;
    })[]>;
}
