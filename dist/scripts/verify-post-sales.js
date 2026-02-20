"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting verification...');
    let workspace = await prisma.workspace.findFirst({ where: { name: 'Verification Workspace' } });
    if (!workspace) {
        workspace = await prisma.workspace.create({
            data: { name: 'Verification Workspace' },
        });
    }
    console.log(`Using workspace: ${workspace.id}`);
    const product = await prisma.product.create({
        data: {
            workspaceId: workspace.id,
            name: 'Test Product',
            price: 100.00,
            stock: 10,
        },
    });
    console.log(`Created product: ${product.id}`);
    const post = await prisma.post.create({
        data: {
            workspaceId: workspace.id,
            content: 'Check out this amazing product!',
            status: client_1.PostStatus.PUBLISHED,
            products: {
                connect: { id: product.id },
            },
        },
        include: { products: true },
    });
    console.log(`Created post: ${post.id}`);
    console.log(`Post linked products: ${post.products.length}`);
    if (post.products.length !== 1 || post.products[0].id !== product.id) {
        throw new Error('Post-Product linkage failed!');
    }
    const customer = await prisma.customer.create({
        data: {
            workspaceId: workspace.id,
            name: 'Test Customer',
            email: `test-${Date.now()}@example.com`,
        },
    });
    const order = await prisma.order.create({
        data: {
            workspaceId: workspace.id,
            customerId: customer.id,
            totalAmount: product.price,
            sourcePostId: post.id,
            items: {
                create: {
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                },
            },
        },
        include: { sourcePost: true },
    });
    console.log(`Created order: ${order.id}`);
    console.log(`Order source post: ${order.sourcePostId}`);
    if (order.sourcePostId !== post.id) {
        throw new Error('Order-Post attribution failed!');
    }
    console.log('Verification SUCCESS!');
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.post.delete({ where: { id: post.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=verify-post-sales.js.map