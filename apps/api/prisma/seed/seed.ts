import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../../src/logger/logger.service';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const logger = new LoggerService();
const COMPANIES = [
  {
    name: 'Google',
  },
  {
    name: 'Amazon',
  },
  {
    name: 'Meta',
  },
  {
    name: 'Microsoft',
  },
  {
    name: 'Apple',
  },
  {
    name: 'Netflix',
  },
  {
    name: 'Uber',
  },
  {
    name: 'Stripe',
  },
  {
    name: 'Airbnb',
  },
  {
    name: 'Startup',
  },
];
async function main() {
  const companies = await prisma.company.createMany({
    data: COMPANIES,
  });
  logger.log({ companies });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    logger.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
