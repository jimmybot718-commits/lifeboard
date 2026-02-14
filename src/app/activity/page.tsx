import prisma from '@/lib/prisma'
import ActivityTimeline from '@/components/ActivityTimeline'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  // Fetch recent activities (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Tasks
  const tasks = await prisma.task.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    include: { actor: true, project: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Work Logs
  const workLogs = await prisma.workLog.findMany({
    where: { date: { gte: sevenDaysAgo } },
    include: { actor: true, project: true },
    orderBy: { date: 'desc' },
    take: 50,
  })

  // Money Entries
  const moneyEntries = await prisma.moneyEntry.findMany({
    where: { date: { gte: sevenDaysAgo } },
    include: { project: true },
    orderBy: { date: 'desc' },
    take: 50,
  })

  // Videos
  const videos = await prisma.instagramVideo.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Emails
  const emails = await prisma.partnershipEmail.findMany({
    where: { sentAt: { gte: sevenDaysAgo } },
    orderBy: { sentAt: 'desc' },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">📜 Activity Timeline</h1>
          <p className="text-slate-400 mt-2">Tous les événements récents (7 derniers jours)</p>
        </div>

        <ActivityTimeline
          tasks={tasks}
          workLogs={workLogs}
          moneyEntries={moneyEntries}
          videos={videos}
          emails={emails}
        />
      </main>
    </div>
  )
}
