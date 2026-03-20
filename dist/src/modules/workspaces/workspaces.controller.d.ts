import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
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
        subscription: {
            id: string;
            plan: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            status: string;
            paystackCustomerId: string | null;
            currentPeriodEnd: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
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
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
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
                phoneNumber: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            role: import("@prisma/client").$Enums.UserRole;
            userId: string;
        })[];
        payoutAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            bankName: string;
            accountNumber: string;
            isDefault: boolean;
        }[];
    } & {
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<{
        id: string;
        name: string;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
