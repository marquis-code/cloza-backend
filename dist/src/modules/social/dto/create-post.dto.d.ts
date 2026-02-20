import { Platform } from '@prisma/client';
export declare class PostTargetDto {
    platform: Platform;
    scheduledFor: string;
}
export declare class CreatePostDto {
    workspaceId: string;
    content: string;
    mediaUrls?: string[];
    targets: PostTargetDto[];
    productIds?: string[];
}
