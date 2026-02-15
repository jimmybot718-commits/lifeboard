import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import QuickActions from '@/components/QuickActions'

export const dynamic = 'force-dynamic'

async function getStats() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [tasksToday, tasksDone, workLogsToday, moneyThisMonth, activeProjects] = await Promise.all([
    prisma.task.count({
      where: { createdAt: { gte: startOfDay } }
    }),
    prisma.task.count({
      where: { status: 'done', completedAt: { gte: startOfDay } }
    }),
    prisma.workLog.aggregate({
      where: { date: { gte: startOfDay } },
      _sum: { hours: true }
    }),
    prisma.moneyEntry.aggregate({
      where: { date: { gte: startOfMonth }, type: 'income' },
      _sum: { amount: true }
    }),
    prisma.project.count({
      where: { status: 'active' }
    })
  ])

  return {
    tasksToday,
    tasksDone,
    hoursToday: workLogsToday._sum.hours || 0,
    moneyThisMonth: moneyThisMonth._sum.amount || 0,
    activeProjects
  }
}

async function getActorData(actorName: string) {
  const actor = await prisma.actor.findUnique({ where: { name: actorName } })
  if (!actor) return null

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())

  const [tasks, schedule, projects, hoursThisWeek] = await Promise.all([
    prisma.task.findMany({
      where: { actorId: actor.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { project: true }
    }),
    prisma.scheduleEntry.findMany({
      where: { actorId: actor.id, date: startOfDay },
      orderBy: { startTime: 'asc' }
    }),
    prisma.project.findMany({
      where: { owner: actorName, status: 'active' },
      orderBy: { updatedAt: 'desc' },
      take: 4
    }),
    prisma.workLog.aggregate({
      where: { actorId: actor.id, date: { gte: startOfWeek } },
      _sum: { hours: true }
    })
  ])

  return {
    actor,
    tasks,
    schedule,
    projects,
    hoursThisWeek: hoursThisWeek._sum.hours || 0
  }
}

async function getRecentCrons() {
  return await prisma.cronExecution.findMany({
    take: 8,
    orderBy: { startedAt: 'desc' }
  })
}

async function getActors() {
  return await prisma.actor.findMany({ orderBy: { label: 'asc' } })
}

async function getActiveProjects() {
  return await prisma.project.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' }
  })
}

export default async function Home() {
  const [stats, alexData, nastiaData, crons, actors, activeProjects] = await Promise.all([
    getStats(),
    getActorData('alex'),
    getActorData('nastia'),
    getRecentCrons(),
    getActors(),
    getActiveProjects()
  ])

  return (
    <div className="min-h-screen bg-carbon-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="noise-overlay" />
      <div className="glow-orb w-[600px] h-[600px] bg-neon-cyan -top-[300px] -right-[200px]" />
      <div className="glow-orb w-[500px] h-[500px] bg-neon-purple -bottom-[200px] -left-[200px]" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-[1600px]">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
            <StatCard
              label="Tasks Today"
              value={stats.tasksToday.toString()}
              subvalue={`${stats.tasksDone} completed`}
              color="cyan"
            />
            <StatCard
              label="Hours Worked"
              value={`${stats.hoursToday}h`}
              subvalue="today"
              color="green"
            />
            <StatCard
              label="Active Projects"
              value={stats.activeProjects.toString()}
              subvalue="in progress"
              color="purple"
            />
            <StatCard
              label="Revenue"
              value={`${stats.moneyThisMonth.toFixed(0)}`}
              subvalue="CHF this month"
              color="orange"
            />
          </div>

          {/* Main Grid - 3 Columns for People */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Alex Column */}
            <PersonColumn
              name="Alex"
              role="Founder"
              color="cyan"
              data={alexData}
              isOnline={true}
            />

            {/* Nastia Column */}
            <PersonColumn
              name="Nastia"
              role="Content Creator"
              color="pink"
              data={nastiaData}
              isOnline={false}
            />

            {/* Jimmy Column - AI Assistant */}
            <JimmyColumn crons={crons} />
          </div>

          {/* Quick Actions */}
          <div className="animate-slide-up animate-delay-400">
            <QuickActions actors={actors} projects={activeProjects} />
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, subvalue, color }: {
  label: string
  value: string
  subvalue: string
  color: 'cyan' | 'green' | 'purple' | 'orange'
}) {
  const colorMap = {
    cyan: 'neon-border-cyan text-neon-cyan',
    green: 'neon-border-green text-neon-green',
    purple: 'neon-border-purple text-neon-purple',
    orange: 'border-neon-orange/30 text-neon-orange'
  }

  return (
    <div className={`glass-card p-5 ${colorMap[color]}`}>
      <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-white/40">{subvalue}</div>
    </div>
  )
}

function PersonColumn({ name, role, color, data, isOnline }: {
  name: string
  role: string
  color: 'cyan' | 'pink' | 'purple'
  data: Awaited<ReturnType<typeof getActorData>>
  isOnline: boolean
}) {
  const colorClasses = {
    cyan: {
      ring: 'avatar-ring-cyan',
      border: 'neon-border-cyan',
      text: 'text-neon-cyan',
      bg: 'bg-neon-cyan',
      gradient: 'from-neon-cyan/20 to-transparent'
    },
    pink: {
      ring: 'avatar-ring-purple',
      border: 'neon-border-pink',
      text: 'text-neon-pink',
      bg: 'bg-neon-pink',
      gradient: 'from-neon-pink/20 to-transparent'
    },
    purple: {
      ring: 'avatar-ring-purple',
      border: 'neon-border-purple',
      text: 'text-neon-purple',
      bg: 'bg-neon-purple',
      gradient: 'from-neon-purple/20 to-transparent'
    }
  }

  const c = colorClasses[color]

  return (
    <div className={`glass-card ${c.border} overflow-hidden animate-slide-up animate-delay-100`}>
      {/* Header gradient */}
      <div className={`h-1 bg-gradient-to-r ${c.gradient}`} />

      <div className="p-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`${c.ring} w-14 h-14`}>
            <div className="w-full h-full rounded-full bg-carbon-800 flex items-center justify-center text-xl font-bold">
              {name[0]}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{name}</h2>
              <div className={`status-dot ${isOnline ? 'status-active' : 'status-offline'}`} />
            </div>
            <div className="text-sm text-white/50">{role}</div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${c.text}`}>{data?.hoursThisWeek || 0}h</div>
            <div className="text-xs text-white/40">this week</div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Today</h3>
            <Link href="/schedule" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {data?.schedule && data.schedule.length > 0 ? (
              data.schedule.slice(0, 4).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                  <span className="font-mono text-xs text-white/40 w-12">{entry.startTime}</span>
                  <span className="text-sm text-white/80 flex-1 truncate">{entry.title}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-white/30 italic p-2">No events scheduled</div>
            )}
          </div>
        </div>

        {/* Active Projects */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Projects</h3>
            <Link href="/projects" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {data?.projects && data.projects.length > 0 ? (
              data.projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">{project.name}</span>
                    <span className="text-xs text-white/40">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${c.bg}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-white/30 italic">No active projects</div>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Tasks</h3>
            <Link href="/tasks" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {data?.tasks && data.tasks.length > 0 ? (
              data.tasks.slice(0, 4).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-sm text-white/30 italic p-2">No recent tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ task }: { task: { id: string; title: string; status: string; type: string } }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-white/20',
    in_progress: 'bg-neon-orange',
    done: 'bg-neon-green',
    failed: 'bg-neon-pink'
  }

  const typeIcons: Record<string, string> = {
    email: '✉',
    video: '🎬',
    news: '📰',
    custom: '✦'
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors group">
      <div className={`w-2 h-2 rounded-full ${statusColors[task.status] || 'bg-white/20'}`} />
      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors flex-1 truncate">
        {task.title}
      </span>
      <span className="text-xs opacity-50">{typeIcons[task.type] || '✦'}</span>
    </div>
  )
}

function JimmyColumn({ crons }: { crons: Awaited<ReturnType<typeof getRecentCrons>> }) {
  return (
    <div className="glass-card neon-border-green overflow-hidden animate-slide-up animate-delay-200">
      {/* Header gradient */}
      <div className="h-1 bg-gradient-to-r from-neon-green/20 to-transparent" />

      <div className="p-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar-ring-green w-14 h-14">
            <div className="w-full h-full rounded-full bg-carbon-800 flex items-center justify-center text-xl">
              🤖
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Jimmy</h2>
              <div className="status-dot status-active" />
            </div>
            <div className="text-sm text-white/50">AI Assistant</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
            <span className="text-xs text-neon-green font-medium">ONLINE</span>
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-wider">System Status</span>
          </div>
          <div className="text-sm text-white/70">
            All systems operational. Monitoring tasks and automations.
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Activity</h3>
            <Link href="/activity" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-1 relative">
            {crons.length > 0 ? (
              crons.map((cron, index) => (
                <CronItem key={cron.id} cron={cron} isLast={index === crons.length - 1} />
              ))
            ) : (
              <div className="text-sm text-white/30 italic p-2">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CronItem({ cron, isLast }: {
  cron: { id: string; cronName: string; status: string; startedAt: Date }
  isLast: boolean
}) {
  const statusColors: Record<string, string> = {
    running: 'bg-neon-orange',
    success: 'bg-neon-green',
    failed: 'bg-neon-pink'
  }

  const statusIcons: Record<string, string> = {
    running: '◐',
    success: '✓',
    failed: '✕'
  }

  const time = new Date(cron.startedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <div className="relative flex items-start gap-3 py-2 pl-1">
      {!isLast && <div className="timeline-connector" />}
      <div className={`w-6 h-6 rounded-full ${statusColors[cron.status] || 'bg-white/20'} flex items-center justify-center text-xs text-carbon-950 font-bold shrink-0`}>
        {statusIcons[cron.status] || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/70 truncate">{cron.cronName}</div>
        <div className="text-xs text-white/30 font-mono">{time}</div>
      </div>
    </div>
  )
}
