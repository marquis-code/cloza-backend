import { PrismaService } from '../../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class WorkspacesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(name: string, userId: string): Promise<{
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForUser(userId: string): Promise<({
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string | null;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        })[];
    } & {
        id: string;
        name: string;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    addMember(workspaceId: string, userId: string, role?: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        role: import("@prisma/client").$Enums.UserRole;
        userId: string;
    }>;
}
