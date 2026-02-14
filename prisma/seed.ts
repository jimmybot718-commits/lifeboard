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
    skipDuplicates: true,
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
          description: workActivities[randomInt(0, workActivities.length - 1)],
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
        description: workActivities[randomInt(0, workActivities.length - 1)],
        date,
      },
    });
  }

  console.log('✅ 30 days of work logs created');

  // Generate income entries (every 2-4 days)
  const incomeDescriptions = [
    'Academy course sale',
    'TradePilot subscription revenue',
    'Consulting work',
    'Affiliate commission',
    'Trading profits',
    'Freelance project payment',
  ];

  for (let i = 0; i < 30; i += randomInt(2, 4)) {
    const amount = randomInt(50, 500);
    await prisma.moneyEntry.create({
      data: {
        amount,
        type: 'income',
        description: incomeDescriptions[randomInt(0, incomeDescriptions.length - 1)],
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
    skipDuplicates: true,
  });

  console.log('✅ Instagram videos created');

  // Create sample partnership emails
  await prisma.partnershipEmail.createMany({
    data: [
      {
        recipient: 'john@techstartup.com',
        subject: 'Partnership Opportunity - TradePilot',
        body: 'Hi John, I wanted to reach out about a potential partnership...',
        status: 'replied',
        notes: 'Interested in affiliate partnership',
        repliedAt: daysAgo(2),
      },
      {
        recipient: 'sarah@marketingagency.com',
        subject: 'Collaboration on Academy Promotion',
        body: 'Hi Sarah, I love your content marketing work...',
        status: 'interested',
        notes: 'Wants to discuss commission structure',
        repliedAt: daysAgo(5),
      },
      {
        recipient: 'mike@investor.vc',
        subject: 'Investment Opportunity - AIAuto',
        body: 'Hi Mike, We are building a B2B prospection SaaS...',
        status: 'rejected',
        notes: 'Not investing in B2B SaaS right now',
        repliedAt: daysAgo(10),
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
    skipDuplicates: true,
  });

  console.log('✅ Partnership emails created');

  // Create today's schedule
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.scheduleEntry.createMany({
    data: [
      {
        actorId: alex.id,
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9:00
        endTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00
        title: 'Morning Review',
        description: 'Check emails, plan the day',
      },
      {
        actorId: alex.id,
        startTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00
        endTime: new Date(today.getTime() + 13 * 60 * 60 * 1000), // 13:00
        title: 'Deep Work - LifeBoard',
        description: 'Final touches before deployment',
        projectId: lifeboard.id,
      },
      {
        actorId: alex.id,
        startTime: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 15:00
        endTime: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00
        title: 'Sport',
        description: 'Gym session',
      },
      {
        actorId: nastia.id,
        startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00
        endTime: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00
        title: 'Video Shooting',
        description: 'Film 3 Instagram reels',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Schedule entries created');

  // Create sample cron executions
  await prisma.cronExecution.createMany({
    data: [
      {
        cronName: 'lifeboard-dev',
        message: 'Built dashboard with dynamic stats',
        executedAt: daysAgo(2),
      },
      {
        cronName: 'tradepilot-dev',
        message: 'Improved auto-trading algorithm',
        executedAt: daysAgo(1),
      },
      {
        cronName: 'backup',
        message: 'Backup completed successfully',
        executedAt: new Date(),
      },
      {
        cronName: 'lifeboard-dev',
        message: 'Added charts to stats page',
        executedAt: daysAgo(1),
      },
      {
        cronName: 'tradepilot-debrief',
        message: 'Sent progress update to Telegram',
        executedAt: daysAgo(1),
      },
    ],
    skipDuplicates: true,
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
