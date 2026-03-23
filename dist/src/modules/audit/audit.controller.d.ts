import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(query: any): Promise<{
        data: ({
            workspace: {
                name: string;
            } | null;
            user: {
                name: string | null;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            workspaceId: string | null;
            userId: string | null;
            action: string;
            entityType: string;
            entityId: string | null;
            details: import("@prisma/client/runtime/client").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
}
