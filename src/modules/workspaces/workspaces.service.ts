import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
    constructor(private prisma: PrismaService) { }

    async create(name: string, userId: string) {
        return this.prisma.workspace.create({
            data: {
                name,
                members: {
                    create: {
                        userId,
                        role: UserRole.OWNER,
                    },
                },
            },
            include: {
                members: true,
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: true,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async addMember(workspaceId: string, userId: string, role: UserRole = UserRole.MEMBER) {
        return this.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role,
            },
        });
    }
}
