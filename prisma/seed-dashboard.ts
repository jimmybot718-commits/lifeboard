import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding dashboard data...')

  // Clear existing data (optional - comment if you want to keep)
  await prisma.cronExecution.deleteMany()
  await prisma.scheduleEntry.deleteMany()
  await prisma.moneyEntry.deleteMany()
  await prisma.workLog.deleteMany()

  // Get actors
  const alex = await prisma.actor.findUnique({ where: { name: 'alex' } })
  const nastia = await prisma.actor.findUnique({ where: { name: 'nastia' } })
  const jimmy = await prisma.actor.findUnique({ where: { name: 'jimmy' } })

  if (!alex || !nastia || !jimmy) {
    throw new Error('Actors not found - run main seed first')
  }

  // Get projects
  const lifeboard = await prisma.project.findFirst({ where: { name: 'LifeBoard' } })
  const tradepilot = await prisma.project.findFirst({ where: { name: 'TradePilot' } })
  const academy = await prisma.project.findFirst({ where: { name: 'OpenClaw Academy' } })

  // Add today's schedule entries
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  await prisma.scheduleEntry.createMany({
    data: [
      {
        actor: 'alex',
        title: 'Réveil',
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00
        recurring: 'daily'
      },
      {
        actor: 'alex',
        title: 'Sport',
        startTime: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 15:00
        recurring: 'daily'
      },
      {
        actor: 'alex',
        title: 'Recap fin de journée',
        startTime: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 18:00
        recurring: 'daily'
      },
      {
        actor: 'nastia',
        title: 'Filmer Instagram',
        startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00
        recurring: 'weekly',
        dayOfWeek: 1 // Monday
      }
    ]
  })

  // Add some work logs
  await prisma.workLog.createMany({
    data: [
      {
        actorId: alex.id,
        date: today,
        hours: 2.5,
        notes: 'Travail sur aiauto'
      },
      {
        actorId: jimmy.id,
        date: today,
        hours: 4,
        notes: 'Dev LifeBoard + TradePilot'
      }
    ]
  })

  // Add money entries
  await prisma.moneyEntry.createMany({
    data: [
      {
        amount: 150,
        currency: 'CHF',
        type: 'income',
        source: 'instagram',
        description: 'Sponsoring post',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        amount: 300,
        currency: 'CHF',
        type: 'income',
        source: 'onlyfans',
        description: 'Subscriptions',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  })

  // Add cron executions (Jimmy's work)
  await prisma.cronExecution.createMany({
    data: [
      {
        cronName: 'lifeboard-dev',
        startedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
        endedAt: new Date(now.getTime() - 25 * 60 * 1000),
        status: 'success',
        result: 'Dashboard made dynamic with real data'
      },
      {
        cronName: 'tradepilot-dev',
        startedAt: new Date(now.getTime() - 90 * 60 * 1000), // 90 min ago
        endedAt: new Date(now.getTime() - 85 * 60 * 1000),
        status: 'success',
        result: 'Added risk management system'
      },
      {
        cronName: 'openclaw-academy-dev',
        startedAt: new Date(now.getTime() - 120 * 60 * 1000), // 2h ago
        endedAt: new Date(now.getTime() - 115 * 60 * 1000),
        status: 'success',
        result: 'Tutorial 9/9 completed'
      }
    ]
  })

  // Add some tasks if projects exist
  if (lifeboard) {
    await prisma.task.create({
      data: {
        actorId: jimmy.id,
        projectId: lifeboard.id,
        type: 'development',
        title: 'Make dashboard dynamic',
        description: 'Connect real data from database',
        status: 'in_progress'
      }
    })
  }

  if (tradepilot) {
    await prisma.task.create({
      data: {
        actorId: jimmy.id,
        projectId: tradepilot.id,
        type: 'development',
        title: 'Auto-trading system',
        description: 'Implement position opening on activation',
        status: 'done',
        completedAt: new Date(now.getTime() - 60 * 60 * 1000),
        result: 'Working - positions auto-open with TP/SL'
      }
    })
  }

  console.log('✅ Dashboard data seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
