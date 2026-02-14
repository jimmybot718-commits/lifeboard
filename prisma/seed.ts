import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create actors if they don't exist
  const alex = await prisma.actor.upsert({
    where: { name: 'alex' },
    update: {},
    create: {
      name: 'alex',
      label: 'Alex',
      type: 'human',
    },
  });

  const nastia = await prisma.actor.upsert({
    where: { name: 'nastia' },
    update: {},
    create: {
      name: 'nastia',
      label: 'Nastia',
      type: 'human',
    },
  });

  const jimmy = await prisma.actor.upsert({
    where: { name: 'jimmy' },
    update: {},
    create: {
      name: 'jimmy',
      label: 'Jimmy',
      type: 'ai',
    },
  });

  console.log('✅ Actors created:', { alex, nastia, jimmy });

  // Create initial projects
  const lifeboard = await prisma.project.upsert({
    where: { id: 'lifeboard-1' },
    update: {},
    create: {
      id: 'lifeboard-1',
      name: 'LifeBoard',
      description: 'Personal dashboard for Alex & Nastia',
      progress: 15,
      owner: 'jimmy',
      status: 'active',
    },
  });

  const tradepilot = await prisma.project.upsert({
    where: { id: 'tradepilot-1' },
    update: {},
    create: {
      id: 'tradepilot-1',
      name: 'TradePilot',
      description: 'Automated gold trading SaaS',
      progress: 70,
      owner: 'jimmy',
      status: 'active',
    },
  });

  const academy = await prisma.project.upsert({
    where: { id: 'academy-1' },
    update: {},
    create: {
      id: 'academy-1',
      name: 'OpenClaw Academy',
      description: 'AI assistant creation courses',
      progress: 90,
      owner: 'jimmy',
      status: 'active',
    },
  });

  console.log('✅ Projects created:', { lifeboard, tradepilot, academy });

  // Create a few sample tasks
  await prisma.task.create({
    data: {
      actorId: jimmy.id,
      type: 'development',
      title: 'Build Tasks System for LifeBoard',
      description: 'Create API routes, UI components, and database models for task management',
      status: 'in_progress',
      projectId: lifeboard.id,
    },
  });

  await prisma.task.create({
    data: {
      actorId: jimmy.id,
      type: 'development',
      title: 'Setup initial project structure',
      description: 'Create repo, setup Next.js, Prisma, Tailwind',
      status: 'done',
      projectId: lifeboard.id,
      completedAt: new Date(),
      result: 'Project initialized with all core dependencies',
    },
  });

  console.log('✅ Sample tasks created');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
