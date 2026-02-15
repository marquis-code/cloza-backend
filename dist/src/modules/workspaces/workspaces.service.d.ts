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
            role: import("@prisma/client").$Enums.UserRole;
            workspaceId: string;
            userId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    findAllForUser(userId: string): Promise<({
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            workspaceId: string;
            userId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    })[]>;
    findById(id: string): Promise<({
        members: ({
            user: {
                name: string | null;
                id: string;
                email: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            workspaceId: string;
            userId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }) | null>;
    addMember(workspaceId: string, userId: string, role?: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        workspaceId: string;
        userId: string;
    }>;
}
