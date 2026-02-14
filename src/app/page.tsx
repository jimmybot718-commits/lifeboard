import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import QuickActions from '@/components/QuickActions'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

async function getStats() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [tasksToday, workLogsToday, moneyThisMonth, activeProjects] = await Promise.all([
    // Tasks today
    prisma.task.count({
      where: {
        createdAt: { gte: startOfDay }
      }
    }),
    
    // Hours worked today
    prisma.workLog.aggregate({
      where: {
        date: { gte: startOfDay }
      },
      _sum: { hours: true }
    }),
    
    // Money this month
    prisma.moneyEntry.aggregate({
      where: {
        date: { gte: startOfMonth },
        type: 'income'
      },
      _sum: { amount: true }
    }),
    
    // Active projects
    prisma.project.count({
      where: { status: 'active' }
    })
  ])

  return {
    tasksToday,
    hoursToday: workLogsToday._sum.hours || 0,
    moneyThisMonth: moneyThisMonth._sum.amount || 0,
    activeProjects
  }
}

async function getRecentTasks() {
  return await prisma.task.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { actor: true, project: true }
  })
}

async function getRecentCrons() {
  return await prisma.cronExecution.findMany({
    take: 5,
    orderBy: { startedAt: 'desc' }
  })
}

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' }
  })
}

async function getTodaySchedule() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return await prisma.scheduleEntry.findMany({
    where: {
      date: startOfDay
    },
    include: {
      actor: true,
      project: true
    },
    orderBy: { startTime: 'asc' }
  })
}

async function getActors() {
  return await prisma.actor.findMany({
    orderBy: { label: 'asc' }
  })
}

async function getActiveProjects() {
  return await prisma.project.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' }
  })
}

export default async function Home() {
  const stats = await getStats()
  const tasks = await getRecentTasks()
  const crons = await getRecentCrons()
  const projects = await getProjects()
  const schedule = await getTodaySchedule()
  const actors = await getActors()
  const activeProjects = await getActiveProjects()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />

      <main className="container mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Tasks Aujourd'hui" value={stats.tasksToday.toString()} color="blue" />
          <StatCard title="Heures Travaillées" value={`${stats.hoursToday}h`} color="green" />
          <StatCard title="Projets Actifs" value={stats.activeProjects.toString()} color="purple" />
          <StatCard title="Argent ce Mois" value={`${stats.moneyThisMonth.toFixed(0)} CHF`} color="amber" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions actors={actors} projects={activeProjects} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planning */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📅 Planning Aujourd&apos;hui
            </h2>
            <div className="space-y-3">
              {schedule.length === 0 ? (
                <div className="text-slate-400 text-sm">Aucun événement prévu</div>
              ) : (
                schedule.map(entry => (
                  <PlanningItem 
                    key={entry.id}
                    time={entry.startTime}
                    title={entry.title}
                    actor={entry.actor.label}
                  />
                ))
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ✅ Tasks Récentes
            </h2>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <TaskItem title="Aucune tâche pour le moment" status="pending" />
              ) : (
                tasks.slice(0, 5).map(task => (
                  <TaskItem 
                    key={task.id}
                    title={task.title}
                    status={task.status}
                    actor={task.actor.label}
                  />
                ))
              )}
            </div>
            <Link href="/tasks" className="block mt-4 text-blue-400 hover:underline text-sm">
              Voir toutes les tasks →
            </Link>
          </div>

          {/* Jimmy's Work */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🤖 Jimmy (Actions Auto)
            </h2>
            <div className="space-y-3">
              {crons.length === 0 ? (
                <div className="text-slate-400 text-sm">Aucune action récente</div>
              ) : (
                crons.slice(0, 5).map(cron => (
                  <JimmyAction 
                    key={cron.id}
                    time={new Date(cron.startedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    action={cron.cronName}
                    status={cron.status}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📊 Projets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.length === 0 ? (
              <div className="text-slate-400 text-sm">Aucun projet actif</div>
            ) : (
              projects.map(project => (
                <ProjectCard 
                  key={project.id}
                  name={project.name}
                  progress={project.progress}
                  owner={project.owner}
                  status={project.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Nastia's Planning */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            👧 Planning Nastia (cette semaine)
          </h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            <DayCard day="Lun" activity="Instagram" highlight />
            <DayCard day="Mar" activity="Instagram" highlight />
            <DayCard day="Mer" activity="OnlyFans" warning />
            <DayCard day="Jeu" activity="-" />
            <DayCard day="Ven" activity="Debrief" />
            <DayCard day="Sam" activity="-" />
            <DayCard day="Dim" activity="-" />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  }
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  )
}

function PlanningItem({ time, title, actor }: { time: string; title: string; actor: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50">
      <span className="text-slate-400 font-mono text-sm w-14">{time}</span>
      <span className="flex-1">{title}</span>
      <span className="text-xs text-slate-500 uppercase">{actor}</span>
    </div>
  )
}

function TaskItem({ title, status, actor }: { title: string; status: string; actor?: string }) {
  const statusIcons: Record<string, string> = {
    pending: '○',
    in_progress: '◐',
    done: '●',
    failed: '✕',
  }
  const statusColors: Record<string, string> = {
    pending: 'text-slate-400',
    in_progress: 'text-yellow-400',
    done: 'text-green-400',
    failed: 'text-red-400',
  }
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-700/50">
      <span className={statusColors[status] || 'text-slate-400'}>{statusIcons[status] || '○'}</span>
      <span className="flex-1">{title}</span>
      {actor && <span className="text-xs text-slate-500">{actor}</span>}
    </div>
  )
}

function JimmyAction({ time, action, status }: { time: string; action: string; status: string }) {
  const statusColors: Record<string, string> = {
    running: 'text-yellow-400',
    success: 'text-green-400',
    failed: 'text-red-400',
  }
  const statusIcons: Record<string, string> = {
    running: '⟳',
    success: '✓',
    failed: '✕',
  }
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-700/50">
      <span className="text-slate-400 font-mono text-sm w-14">{time}</span>
      <span className="flex-1">{action}</span>
      <span className={`text-xs ${statusColors[status]}`}>
        {statusIcons[status]} {status}
      </span>
    </div>
  )
}

function ProjectCard({ name, progress, owner, status }: { name: string; progress: number; owner: string; status: string }) {
  return (
    <div className={`bg-slate-700/50 rounded-lg p-4 ${status === 'paused' ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-slate-400 uppercase">{owner}</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 mb-1">
        <div 
          className={`h-2 rounded-full transition-all ${
            status === 'completed' ? 'bg-green-500' : 
            status === 'paused' ? 'bg-slate-500' : 
            'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-slate-400">{progress}%</span>
    </div>
  )
}

function DayCard({ day, activity, highlight, warning }: { day: string; activity: string; highlight?: boolean; warning?: boolean }) {
  let bgClass = 'bg-slate-700/50'
  if (highlight) bgClass = 'bg-blue-500/20 border border-blue-500/30'
  if (warning) bgClass = 'bg-amber-500/20 border border-amber-500/30'
  
  return (
    <div className={`p-2 rounded ${bgClass}`}>
      <div className="font-medium">{day}</div>
      <div className="text-xs text-slate-400 mt-1">{activity}</div>
    </div>
  )
}
