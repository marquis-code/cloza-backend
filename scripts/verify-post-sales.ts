import { PrismaClient, PostStatus, Platform } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting verification...');

    // 1. Create a Workspace (if needed, or use existing)
    // For simplicity, let's assume we can create a dummy one or find one.
    let workspace = await prisma.workspace.findFirst({ where: { name: 'Verification Workspace' } });
    if (!workspace) {
        workspace = await prisma.workspace.create({
            data: { name: 'Verification Workspace' },
        });
    }
    console.log(`Using workspace: ${workspace.id}`);

    // 2. Create a Product
    const product = await prisma.product.create({
        data: {
            workspaceId: workspace.id,
            name: 'Test Product',
            price: 100.00,
            stock: 10,
        },
    });
    console.log(`Created product: ${product.id}`);

    // 3. Create a Post linked to the Product
    const post = await prisma.post.create({
        data: {
            workspaceId: workspace.id,
            content: 'Check out this amazing product!',
            status: PostStatus.PUBLISHED,
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

    // 4. Create a Customer
    const customer = await prisma.customer.create({
        data: {
            workspaceId: workspace.id,
            name: 'Test Customer',
            email: `test-${Date.now()}@example.com`,
        },
    });

    // 5. Create an Order attributed to the Post
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

    // Cleanup
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.post.delete({ where: { id: post.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    // workspace cleanup optional
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
