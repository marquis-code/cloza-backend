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
    }
    catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=cleanup-test-user.js.map