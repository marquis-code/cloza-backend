import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    getUserFeatures(userId: string): Promise<{
        activePlan: string;
        planName: string;
        features: string[];
        featureSlugs: string[];
        limits: {
            socialAccounts: number;
            quickReplies: number;
            paymentLinks: number;
            scheduledPosts: number;
            teamMembers: number;
        };
    }>;
}
