import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate random data
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function main() {
  console.log('🌱 Seeding database...');

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
      progress: 85,
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
      progress: 95,
      owner: 'jimmy',
      status: 'active',
    },
  });

  const aiauto = await prisma.project.upsert({
    where: { id: 'aiauto-1' },
    update: {},
    create: {
      id: 'aiauto-1',
      name: 'AIAuto',
      description: 'B2B prospection automation platform',
      progress: 45,
      owner: 'alex',
      status: 'paused',
    },
  });

  console.log('✅ Projects created:', { lifeboard, tradepilot, academy, aiauto });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        actorId: jimmy.id,
        type: 'development',
        title: 'Build LifeBoard Dashboard',
        description: 'Create homepage with dynamic stats and planning view',
        status: 'done',
        projectId: lifeboard.id,
        completedAt: daysAgo(2),
        result: 'Dashboard fully functional with live data from database',
      },
      {
        actorId: jimmy.id,
        type: 'development',
        title: 'Implement Charts for Stats Page',
        description: 'Add Recharts to visualize work hours and money over time',
        status: 'done',
        projectId: lifeboard.id,
        completedAt: daysAgo(1),
        result: 'Line charts displaying daily work hours and income',
      },
      {
        actorId: jimmy.id,
        type: 'development',
        title: 'Deploy LifeBoard to Vercel',
        description: 'Migrate to PostgreSQL and deploy production build',
        status: 'in_progress',
        projectId: lifeboard.id,
      },
      {
        actorId: jimmy.id,
        type: 'development',
        title: 'Improve TradePilot auto-trading logic',
        description: 'Optimize entry/exit signals based on RSI and moving averages',
        status: 'in_progress',
        projectId: tradepilot.id,
      },
      {
        actorId: alex.id,
        type: 'business',
        title: 'Contact potential Academy customers',
        description: 'Reach out to indie hackers interested in AI assistants',
        status: 'pending',
        projectId: academy.id,
      },
    ],
  });

  console.log('✅ Sample tasks created');

  // Generate 30 days of work logs
  const workActivities = [
    'Development on LifeBoard',
    'Building TradePilot features',
    'Writing Academy tutorials',
    'Testing and debugging',
    'Research and planning',
    'Code review and optimization',
    'UI/UX improvements',
    'Database modeling',
    'API development',
    'Documentation writing',
  ];

  for (let i = 0; i < 30; i++) {
    const date = daysAgo(i);
    
    // Alex works 3-6 hours per day (weekdays mostly)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (!isWeekend || Math.random() > 0.5) {
      const alexHours = randomFloat(2, 6, 1);
      await prisma.workLog.create({
        data: {
          actorId: alex.id,
          projectId: i < 5 ? lifeboard.id : i < 15 ? tradepilot.id : academy.id,
          hours: alexHours,
          notes: workActivities[randomInt(0, workActivities.length - 1)],
          date,
        },
      });
    }

    // Jimmy works 8-12 hours per day (AI never sleeps)
    const jimmyHours = randomFloat(8, 12, 1);
    await prisma.workLog.create({
      data: {
        actorId: jimmy.id,
        projectId: i < 10 ? lifeboard.id : i < 20 ? tradepilot.id : academy.id,
        hours: jimmyHours,
        notes: workActivities[randomInt(0, workActivities.length - 1)],
        date,
      },
    });
  }

  console.log('✅ 30 days of work logs created');

  // Generate income entries (every 2-4 days)
  const incomeSources = [
    { source: 'academy', description: 'Academy course sale' },
    { source: 'tradepilot', description: 'TradePilot subscription revenue' },
    { source: 'consulting', description: 'Consulting work' },
    { source: 'affiliate', description: 'Affiliate commission' },
    { source: 'trading', description: 'Trading profits' },
    { source: 'freelance', description: 'Freelance project payment' },
  ];

  for (let i = 0; i < 30; i += randomInt(2, 4)) {
    const amount = randomInt(50, 500);
    const sourceData = incomeSources[randomInt(0, incomeSources.length - 1)];
    await prisma.moneyEntry.create({
      data: {
        amount,
        type: 'income',
        source: sourceData.source,
        description: sourceData.description,
        projectId: Math.random() > 0.5 ? tradepilot.id : academy.id,
        date: daysAgo(i),
      },
    });
  }

  console.log('✅ Income entries created');

  // Create sample Instagram videos
  await prisma.instagramVideo.createMany({
    data: [
      {
        url: 'https://instagram.com/reel/abc123',
        title: 'Thailand Morning Routine',
        description: 'Morning vlog from Chiang Mai',
        forWhom: 'nastia',
        status: 'posted',
        postedAt: daysAgo(3),
      },
      {
        url: 'https://instagram.com/reel/def456',
        title: 'Trading Tips for Beginners',
        description: 'Quick guide to gold trading',
        forWhom: 'alex',
        status: 'posted',
        postedAt: daysAgo(7),
      },
      {
        url: 'https://instagram.com/reel/ghi789',
        title: 'Fitness Workout Video',
        description: '15-minute home workout',
        forWhom: 'nastia',
        status: 'draft',
      },
      {
        url: 'https://instagram.com/reel/jkl012',
        title: 'AI Assistant Demo',
        description: 'Showing off Jimmy capabilities',
        forWhom: 'alex',
        status: 'draft',
      },
    ],
  });

  console.log('✅ Instagram videos created');

  // Create sample partnership emails
  await prisma.partnershipEmail.createMany({
    data: [
      {
        recipient: 'john@techstartup.com',
        subject: 'Collaboration Opportunity - TradePilot',
        body: 'Hi John, I saw your work on financial tools and thought we might collaborate...',
        status: 'replied',
        repliedAt: daysAgo(5),
        notes: 'Positive response, follow up next week',
      },
      {
        recipient: 'sarah@growthagency.com',
        subject: 'Partnership Proposal',
        body: 'Hi Sarah, Your agency could benefit from our AI automation tools...',
        status: 'interested',
        repliedAt: daysAgo(10),
        notes: 'Wants to schedule a demo call',
      },
      {
        recipient: 'mike@startup.io',
        subject: 'Integration Opportunity',
        body: 'Hi Mike, I believe our platforms could integrate seamlessly...',
        status: 'rejected',
        repliedAt: daysAgo(15),
      },
      {
        recipient: 'lisa@influencer.com',
        subject: 'Sponsored Content Opportunity',
        body: 'Hi Lisa, Would you be interested in promoting our trading platform?',
        status: 'sent',
      },
      {
        recipient: 'david@corporation.com',
        subject: 'Enterprise Partnership Discussion',
        body: 'Hi David, I believe our tools could benefit your team...',
        status: 'pending',
      },
    ],
  });

  console.log('✅ Partnership emails created');

  // Create today's schedule
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.scheduleEntry.createMany({
    data: [
      {
        actorId: alex.id,
        date: today,
        startTime: '09:00',
        endTime: '10:00',
        title: 'Morning Review',
        description: 'Check emails, plan the day',
      },
      {
        actorId: alex.id,
        date: today,
        startTime: '10:00',
        endTime: '13:00',
        title: 'Deep Work - LifeBoard',
        description: 'Final touches before deployment',
        projectId: lifeboard.id,
      },
      {
        actorId: alex.id,
        date: today,
        startTime: '15:00',
        endTime: '16:00',
        title: 'Sport',
        description: 'Gym session',
      },
      {
        actorId: nastia.id,
        date: today,
        startTime: '14:00',
        endTime: '16:00',
        title: 'Video Shooting',
        description: 'Film 3 Instagram reels',
      },
    ],
  });

  console.log('✅ Schedule entries created');

  // Create sample cron executions
  await prisma.cronExecution.createMany({
    data: [
      {
        cronName: 'lifeboard-dev',
        result: 'Built dashboard with dynamic stats',
        startedAt: daysAgo(2),
        endedAt: daysAgo(2),
        status: 'success',
      },
      {
        cronName: 'tradepilot-dev',
        result: 'Improved auto-trading algorithm',
        startedAt: daysAgo(1),
        endedAt: daysAgo(1),
        status: 'success',
      },
      {
        cronName: 'backup',
        result: 'Backup completed successfully',
        startedAt: new Date(),
        endedAt: new Date(),
        status: 'success',
      },
      {
        cronName: 'lifeboard-dev',
        result: 'Added charts to stats page',
        startedAt: daysAgo(1),
        endedAt: daysAgo(1),
        status: 'success',
      },
      {
        cronName: 'tradepilot-debrief',
        result: 'Sent progress update to Telegram',
        startedAt: daysAgo(1),
        endedAt: daysAgo(1),
        status: 'success',
      },
    ],
  });

  console.log('✅ Cron executions created');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('📊 Generated:');
  console.log('  - 3 actors (Alex, Nastia, Jimmy)');
  console.log('  - 4 projects (LifeBoard, TradePilot, Academy, AIAuto)');
  console.log('  - 5 tasks');
  console.log('  - ~45 work logs (30 days of data)');
  console.log('  - ~10 income entries');
  console.log('  - 4 Instagram videos');
  console.log('  - 5 partnership emails');
  console.log('  - 4 schedule entries (today)');
  console.log('  - 5 cron executions');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
