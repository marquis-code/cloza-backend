import * as dotenv from 'dotenv';
dotenv.config({ silent: true } as any);
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TARGET_EMAIL = 'james@getcloza.com';

async function main() {
  try {
    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) {
      console.log(`User with email "${TARGET_EMAIL}" not found.`);
      return;
    }
    console.log(`Found user: ${user.id} (${user.email})`);

    const userId = user.id;

    // 2. Find all workspace memberships for this user
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    });

    console.log(`User belongs to ${memberships.length} workspace(s)`);

    // 3. For each workspace where this user is the OWNER, delete all workspace data
    for (const membership of memberships) {
      const ws = membership.workspace;
      if (membership.role === 'OWNER') {
        console.log(`Deleting workspace "${ws.name}" (${ws.id}) — user is OWNER`);

        // Delete in dependency order
        await prisma.message.deleteMany({ where: { conversation: { workspaceId: ws.id } } });
        await prisma.conversation.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.orderItem.deleteMany({ where: { order: { workspaceId: ws.id } } });
        await prisma.order.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.customer.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.engagementMetric.deleteMany({ where: { post: { workspaceId: ws.id } } });
        await prisma.postTarget.deleteMany({ where: { post: { workspaceId: ws.id } } });
        await prisma.post.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.product.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.payoutAccount.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.subscription.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.socialAccount.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.auditLog.deleteMany({ where: { workspaceId: ws.id } });
        // Remove all other members from this workspace
        await prisma.workspaceMember.deleteMany({ where: { workspaceId: ws.id } });
        await prisma.workspace.delete({ where: { id: ws.id } });
        console.log(`  ✅ Workspace "${ws.name}" deleted.`);
      } else {
        console.log(`Removing membership from workspace "${ws.name}" (${ws.id}) — user is ${membership.role}`);
        await prisma.workspaceMember.delete({ where: { id: membership.id } });
      }
    }

    // 4. Delete user-level data
    await prisma.auditLog.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    console.log(`\n✅ Account "${TARGET_EMAIL}" and all related data has been deleted.`);
  } catch (error) {
    console.error('Error deleting account:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}

main();
