import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(workspaceId: string, customerId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        items: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        items: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        items: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        items: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findByCustomer(workspaceId: string, customerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        customerId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        items: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
