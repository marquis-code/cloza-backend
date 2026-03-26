"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ silent: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const TARGET_EMAIL = 'james@getcloza.com';
async function main() {
    try {
        const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
        if (!user) {
            console.log(`User with email "${TARGET_EMAIL}" not found.`);
            return;
        }
        console.log(`Found user: ${user.id} (${user.email})`);
        const userId = user.id;
        const memberships = await prisma.workspaceMember.findMany({
            where: { userId },
            include: { workspace: true },
        });
        console.log(`User belongs to ${memberships.length} workspace(s)`);
        for (const membership of memberships) {
            const ws = membership.workspace;
            if (membership.role === 'OWNER') {
                console.log(`Deleting workspace "${ws.name}" (${ws.id}) — user is OWNER`);
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
                await prisma.workspaceMember.deleteMany({ where: { workspaceId: ws.id } });
                await prisma.workspace.delete({ where: { id: ws.id } });
                console.log(`  ✅ Workspace "${ws.name}" deleted.`);
            }
            else {
                console.log(`Removing membership from workspace "${ws.name}" (${ws.id}) — user is ${membership.role}`);
                await prisma.workspaceMember.delete({ where: { id: membership.id } });
            }
        }
        await prisma.auditLog.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
        console.log(`\n✅ Account "${TARGET_EMAIL}" and all related data has been deleted.`);
    }
    catch (error) {
        console.error('Error deleting account:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
        pool.end();
    }
}
main();
//# sourceMappingURL=delete-user-account.js.map