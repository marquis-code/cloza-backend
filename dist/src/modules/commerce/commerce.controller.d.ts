import { CommerceService } from './commerce.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class CommerceController {
    private commerceService;
    constructor(commerceService: CommerceService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
        workspaceId: string;
    }>;
    getProducts(workspaceId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
        workspaceId: string;
    }[]>;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            email: string | null;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    }>;
    getOrders(workspaceId: string): Promise<({
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            email: string | null;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                currency: string;
                imageUrl: string | null;
                stock: number;
                active: boolean;
                workspaceId: string;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    })[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        workspaceId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
        sourcePostId: string | null;
    }>;
}
