import { CommerceService } from './commerce.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class CommerceController {
    private commerceService;
    constructor(commerceService: CommerceService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
    }>;
    getProducts(workspaceId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        imageUrl: string | null;
        stock: number;
        active: boolean;
    }[]>;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        customer: {
            name: string;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: string;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    }>;
    getOrders(workspaceId: string): Promise<({
        customer: {
            name: string;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            phone: string | null;
            platform: import("@prisma/client").$Enums.Platform | null;
            platformCustomerId: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                workspaceId: string;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                currency: string;
                imageUrl: string | null;
                stock: number;
                active: boolean;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    })[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        currency: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentLink: string | null;
        paidAt: Date | null;
        customerId: string;
    }>;
}
