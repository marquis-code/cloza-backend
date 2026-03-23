import * as dotenv from 'dotenv';
dotenv.config({ silent: true } as any);
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  const workspaceId = process.argv[3];
  
  if (!email) {
    console.error('Email required');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found, skipping cleanup');
      return;
    }

    const userId = user.id;

    // Delete in dependency order
    if (workspaceId && workspaceId !== 'NONE') {
      await prisma.message.deleteMany({ where: { conversation: { workspaceId } } });
      await prisma.conversation.deleteMany({ where: { workspaceId } });
      await prisma.orderItem.deleteMany({ where: { order: { workspaceId } } });
      await prisma.order.deleteMany({ where: { workspaceId } });
      await prisma.customer.deleteMany({ where: { workspaceId } });
      await prisma.engagementMetric.deleteMany({ where: { post: { workspaceId } } });
      await prisma.postTarget.deleteMany({ where: { post: { workspaceId } } });
      await prisma.post.deleteMany({ where: { workspaceId } });
      await prisma.product.deleteMany({ where: { workspaceId } });
      await prisma.payoutAccount.deleteMany({ where: { workspaceId } });
      await prisma.subscription.deleteMany({ where: { workspaceId } });
      await prisma.socialAccount.deleteMany({ where: { workspaceId } });
    }

    await prisma.auditLog.deleteMany({ where: { userId } });
    await prisma.workspaceMember.deleteMany({ where: { userId } });

    if (workspaceId && workspaceId !== 'NONE') {
      await prisma.auditLog.deleteMany({ where: { workspaceId } });
      await prisma.workspace.deleteMany({ where: { id: workspaceId } });
    }

    await prisma.user.delete({ where: { id: userId } });
    console.log('Cleanup complete');
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
