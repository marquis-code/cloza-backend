import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkAccountDto } from './dto/link-account.dto';
export declare class SocialController {
    private socialService;
    constructor(socialService: SocialService);
    createPost(createPostDto: CreatePostDto): Promise<{
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            imageUrl: string | null;
            stock: number;
            active: boolean;
            workspaceId: string;
        }[];
        targets: {
            id: string;
            status: import("@prisma/client").$Enums.PostStatus;
            platform: import("@prisma/client").$Enums.Platform;
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
        mediaUrls: string[];
        status: import("@prisma/client").$Enums.PostStatus;
    }>;
    getPosts(workspaceId: string): Promise<({
        targets: {
            id: string;
            status: import("@prisma/client").$Enums.PostStatus;
            platform: import("@prisma/client").$Enums.Platform;
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
        mediaUrls: string[];
        status: import("@prisma/client").$Enums.PostStatus;
    })[]>;
    linkAccount(linkAccountDto: LinkAccountDto): Promise<{
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
            mediaUrls: string[];
            status: import("@prisma/client").$Enums.PostStatus;
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
