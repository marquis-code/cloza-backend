const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

async function getCode() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  const user = await prisma.user.findUnique({
    where: { email: 'verify_new@example.com' },
    select: { verificationCode: true }
  });
  console.log(user.verificationCode);
  await prisma.$disconnect();
  await pool.end();
}

getCode().catch(console.error);
