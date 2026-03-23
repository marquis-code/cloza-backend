import * as dotenv from 'dotenv';
dotenv.config({ silent: true } as any);
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const workspaceId = process.argv[2];
  const name = process.argv[3] || 'E2E Customer';
  const email = process.argv[4] || `customer_${Date.now()}@example.com`;

  if (!workspaceId) {
    console.error('Workspace ID required');
    process.exit(1);
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        workspaceId,
        name,
        email,
        phone: '+2348000000001',
      }
    });
    console.log(customer.id);
  } catch (error) {
    console.error('Error creating customer:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
