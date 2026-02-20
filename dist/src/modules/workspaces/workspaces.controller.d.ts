import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspacesController {
    private workspacesService;
    constructor(workspacesService: WorkspacesService);
    create(createWorkspaceDto: CreateWorkspaceDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string): Promise<({
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
}
