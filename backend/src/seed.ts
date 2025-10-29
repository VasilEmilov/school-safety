// backend/src/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('ChangeMe123!', 10);

  const overseer = await prisma.user.upsert({
    where: { email: 'overseer@example.com' },
    update: {},
    create: {
      email: 'overseer@example.com',
      password,
      role: Role.OVERSEER,
    },
  });

  const school = await prisma.school.upsert({
    where: { slug: 'central-high' },
    update: {},
    create: {
      name: 'Central High School',
      slug: 'central-high',
    },
  });

  await prisma.user.upsert({
    where: { email: 'principal@example.com' },
    update: {
      schoolId: school.id,
    },
    create: {
      email: 'principal@example.com',
      password,
      role: Role.SCHOOL_ADMIN,
      schoolId: school.id,
    },
  });

  console.log('Seed complete', { overseer: overseer.email, school: school.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
