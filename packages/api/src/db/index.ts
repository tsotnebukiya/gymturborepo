import { PrismaClient } from '@prisma/client';
import type * as PrismaTypes from '@prisma/client';
import { log } from 'next-axiom';

const createPrismaClient = () => {
  const startTime = performance.now();

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  const initDuration = performance.now() - startTime;
  log.debug('Prisma Client initialization', {
    duration: Math.round(initDuration),
    environment: process.env.NODE_ENV,
  });

  return prisma;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const db = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export { db, type PrismaTypes };
