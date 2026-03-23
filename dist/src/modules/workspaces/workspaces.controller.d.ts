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
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            status: string;
            plan: string;
            paystackCustomerId: string | null;
            currentPeriodEnd: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
    }>;
    findAll(req: any): Promise<({
        members: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
    })[]>;
    findOne(id: string): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                name: string | null;
                avatarUrl: string | null;
                phoneNumber: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.UserRole;
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
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
    }) | null>;
    update(id: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        businessCategory: string | null;
        businessLocation: string | null;
        defaultCurrency: string;
        paymentConfirmationMessage: string | null;
        followUpReminders: boolean;
        newBuyerAlerts: boolean;
    }>;
}
