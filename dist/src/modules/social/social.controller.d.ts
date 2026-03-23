import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LinkAccountDto } from './dto/link-account.dto';
export declare class SocialController {
    private socialService;
    constructor(socialService: SocialService);
    createPost(createPostDto: CreatePostDto): Promise<{
        targets: {
            id: string;
            platform: import("@prisma/client").$Enums.Platform;
            status: import("@prisma/client").$Enums.PostStatus;
            scheduledFor: Date;
            publishedAt: Date | null;
            errorMessage: string | null;
            postId: string;
        }[];
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            currency: string;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            imageUrl: string | null;
            type: import("@prisma/client").$Enums.ProductType;
            stock: number;
            active: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        status: import("@prisma/client").$Enums.PostStatus;
        content: string;
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
        status: import("@prisma/client").$Enums.PostStatus;
        content: string;
        mediaUrls: string[];
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
    getAccounts(workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        platform: import("@prisma/client").$Enums.Platform;
        platformAccountId: string;
        accessToken: string;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
    }[]>;
    getMetrics(workspaceId: string): Promise<({
        post: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            status: import("@prisma/client").$Enums.PostStatus;
            content: string;
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
