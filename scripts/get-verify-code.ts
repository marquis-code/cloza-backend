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
  if (!email) {
    console.error('Email required');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { verificationCode: true }
    });
  } catch (error) {
    console.error('Error fetching code:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
